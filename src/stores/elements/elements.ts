import { defineStore } from 'pinia'
import type {
  CanvasElement,
  ShapeElement,
  TextElement,
  IconElement,
} from '@/types/Element'
import type { GroupElement } from '@/types/GroupElement'
import type { ShapeType } from '@/types/ShapeType'
import { normalizePoints } from '@/utils/shapeUtils'

const MAX_HISTORY_SIZE = 50

export interface Snapshot {
  version: number
  timestamp: number
  elements: CanvasElement[]
  nextId: number
}

interface ElementsState {
  elements: CanvasElement[]
  selectedElementIds: string[] // Changed to array for multi-selection
  nextId: number
  history: CanvasElement[][]
  historyIndex: number
  clipboard: CanvasElement[] | null
  customShapes: { name: string; points: string }[]
}

export const useElementsStore = defineStore('elements', {
  state: (): ElementsState => ({
    elements: [],
    selectedElementIds: [], // Changed to array for multi-selection
    nextId: 1,
    history: [[]],
    historyIndex: 0,
    clipboard: [],
    customShapes: [],
  }),

  getters: {
    // Backwards compatible: returns first selected element (or null)
    selectedElement: (state) => {
      if (state.selectedElementIds.length === 0) return null
      return (
        state.elements.find(
          (e: CanvasElement) => e.id === state.selectedElementIds[0]
        ) || null
      )
    },

    // Backwards compatible: returns first selected ID (or null)
    selectedElementId: (state): string | null => {
      return state.selectedElementIds.length > 0
        ? state.selectedElementIds[0]!
        : null
    },

    // New getter for all selected elements
    selectedElements: (state): CanvasElement[] => {
      return state.elements.filter((e: CanvasElement) =>
        state.selectedElementIds.includes(e.id)
      )
    },

    // Check if multiple elements are selected
    hasMultipleSelected: (state): boolean => {
      return state.selectedElementIds.length > 1
    },

    sortedElements: (state): CanvasElement[] => {
      return [...state.elements].sort((a, b) => a.zIndex - b.zIndex)
    },

    // Get only top-level elements (not grouped)
    topLevelElements: (state): CanvasElement[] => {
      return state.elements.filter((e: CanvasElement) => !e.groupId)
    },

    canUndo: (state) => state.historyIndex > 0,
    canRedo: (state) => state.historyIndex < state.history.length - 1,
    hasCopiedElement: (state) =>
      state.clipboard !== null && state.clipboard.length > 0,
  },

  actions: {
    saveCustomShape(name: string, points: string) {
      this.customShapes.push({ name, points: normalizePoints(points) })
    },

    saveSnapshot() {
      if (this.canRedo) {
        this.history = this.history.slice(0, this.historyIndex + 1)
      }

      const snapshot = JSON.parse(
        JSON.stringify(this.elements)
      ) as CanvasElement[]
      this.history.push(snapshot)
      this.historyIndex = this.history.length - 1

      if (this.history.length > MAX_HISTORY_SIZE) {
        this.history.shift()
        this.historyIndex = this.history.length - 1
      }
    },

    undo() {
      if (!this.canUndo) return

      this.historyIndex--
      this.elements = JSON.parse(
        JSON.stringify(this.history[this.historyIndex])
      )

      // Clear selection for elements that no longer exist
      this.selectedElementIds = this.selectedElementIds.filter((id) =>
        this.elements.some((e: CanvasElement) => e.id === id)
      )
    },

    redo() {
      if (!this.canRedo) return

      this.historyIndex++
      this.elements = JSON.parse(
        JSON.stringify(this.history[this.historyIndex])
      )

      // Clear selection for elements that no longer exist
      this.selectedElementIds = this.selectedElementIds.filter((id) =>
        this.elements.some((e: CanvasElement) => e.id === id)
      )
    },

    addElement(element: CanvasElement) {
      this.elements.push(element)
      this.selectedElementIds = [element.id]
      this.saveSnapshot()
    },

    addShape(
      shapeType: ShapeType,
      x: number = 100,
      y: number = 100,
      customPoints?: string
    ) {
      const newShape: ShapeElement = {
        id: `shape-${this.nextId++}`,
        type: 'shape',
        shapeType,
        x,
        y,
        width: 100,
        height: 100,
        outline: '#000',
        fill: 'transparent',
        strokeWeight: 3,
        zIndex: this.elements.length,
        rotation: 0,
        customPoints: shapeType === 'custom' ? customPoints : undefined,
      }
      this.addElement(newShape)
    },

    addText(x: number = 100, y: number = 100) {
      const newText: TextElement = {
        id: `text-${this.nextId++}`,
        type: 'text',
        content: 'Double click to edit',
        x,
        y,
        width: 200,
        height: 50,
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000',
        zIndex: this.elements.length,
        rotation: 0,
      }
      this.addElement(newText)
    },

    addIcon(iconType: string, x: number = 100, y: number = 100) {
      const newIcon: IconElement = {
        id: `icon-${this.nextId++}`,
        type: 'icon',
        iconType,
        x,
        y,
        width: 50,
        height: 50,
        color: '#000',
        strokeWeight: 2,
        zIndex: this.elements.length,
        rotation: 0,
      }
      this.addElement(newIcon)
    },

    updateElement(
      id: string,
      updates: Partial<CanvasElement>,
      saveHistory: boolean = true
    ) {
      const index = this.elements.findIndex((e: CanvasElement) => e.id === id)
      if (index !== -1) {
        this.elements[index] = {
          ...this.elements[index],
          ...updates,
        } as CanvasElement
        if (saveHistory) this.saveSnapshot()
      }
    },

    deleteElement(id: string) {
      const index = this.elements.findIndex((e: CanvasElement) => e.id === id)
      if (index !== -1) {
        this.elements.splice(index, 1)
        // Remove from selection
        this.selectedElementIds = this.selectedElementIds.filter(
          (selectedId) => selectedId !== id
        )
        this.saveSnapshot()
      }
    },

    deleteSelectedElement() {
      if (this.selectedElementIds.length === 0) return

      // Collect all IDs to delete, including children of groups
      const idsToDelete: string[] = []

      this.selectedElementIds.forEach((id) => {
        idsToDelete.push(id)
        const element = this.elements.find((e: CanvasElement) => e.id === id)
        // If it's a group, also include its children
        if (element && element.type === 'group') {
          const groupElement = element as GroupElement
          groupElement.childIds.forEach((childId) => {
            if (!idsToDelete.includes(childId)) {
              idsToDelete.push(childId)
            }
          })
        }
      })

      // Delete all elements in the list
      idsToDelete.forEach((id) => {
        const index = this.elements.findIndex((e: CanvasElement) => e.id === id)
        if (index !== -1) {
          this.elements.splice(index, 1)
        }
      })

      this.selectedElementIds = []
      this.saveSnapshot()
    },

    // Select a single element (replaces current selection)
    selectElement(id: string | null) {
      this.selectedElementIds = id ? [id] : []
    },

    // Toggle element in selection (for Shift+Click)
    toggleElementSelection(id: string) {
      const index = this.selectedElementIds.indexOf(id)
      if (index === -1) {
        this.selectedElementIds.push(id)
      } else {
        this.selectedElementIds.splice(index, 1)
      }
    },

    // Add element to current selection
    addToSelection(id: string) {
      if (!this.selectedElementIds.includes(id)) {
        this.selectedElementIds.push(id)
      }
    },

    // Clear all selection
    clearSelection() {
      this.selectedElementIds = []
    },

    // Group selected elements into a new group
    groupSelectedElements() {
      if (this.selectedElementIds.length < 2) return // Need at least 2 elements to group

      // Collect all elements to group, flattening existing groups
      const elementsToGroup: CanvasElement[] = []
      const groupsToRemove: string[] = []

      this.selectedElementIds.forEach((id) => {
        const element = this.elements.find((e: CanvasElement) => e.id === id)
        if (!element) return

        if (element.type === 'group') {
          // If selecting a group, include its children instead
          const groupElement = element as GroupElement
          groupElement.childIds.forEach((childId) => {
            const child = this.elements.find(
              (e: CanvasElement) => e.id === childId
            )
            if (child && !elementsToGroup.includes(child)) {
              // Clear the old groupId from child
              child.groupId = undefined
              elementsToGroup.push(child)
            }
          })
          // Mark the old group for removal
          groupsToRemove.push(element.id)
        } else if (!element.groupId) {
          // Regular element not in a group
          if (!elementsToGroup.includes(element)) {
            elementsToGroup.push(element)
          }
        }
      })

      if (elementsToGroup.length < 2) return

      // Remove old groups that are being merged
      groupsToRemove.forEach((groupId) => {
        const index = this.elements.findIndex(
          (e: CanvasElement) => e.id === groupId
        )
        if (index !== -1) {
          this.elements.splice(index, 1)
        }
      })

      // Calculate bounding box of all elements
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity
      elementsToGroup.forEach((e) => {
        minX = Math.min(minX, e.x)
        minY = Math.min(minY, e.y)
        maxX = Math.max(maxX, e.x + e.width)
        maxY = Math.max(maxY, e.y + e.height)
      })

      // Create group element
      const groupId = `group-${this.nextId++}`
      const groupElement: GroupElement = {
        id: groupId,
        type: 'group',
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        rotation: 0,
        zIndex: Math.max(...elementsToGroup.map((e) => e.zIndex)) + 1,
        childIds: elementsToGroup.map((e) => e.id),
      }

      // Mark elements as grouped
      elementsToGroup.forEach((e) => {
        e.groupId = groupId
      })

      // Add group to elements
      this.elements.push(groupElement)

      // Select the group
      this.selectedElementIds = [groupId]
      this.saveSnapshot()
    },

    // Ungroup a group element
    ungroupElement(groupId: string) {
      const groupElement = this.elements.find(
        (e: CanvasElement) => e.id === groupId && e.type === 'group'
      ) as GroupElement | undefined

      if (!groupElement) return

      // Remove groupId from child elements
      groupElement.childIds.forEach((childId) => {
        const child = this.elements.find((e: CanvasElement) => e.id === childId)
        if (child) {
          child.groupId = undefined
        }
      })

      // Remove the group element
      const groupIndex = this.elements.findIndex(
        (e: CanvasElement) => e.id === groupId
      )
      if (groupIndex !== -1) {
        this.elements.splice(groupIndex, 1)
      }

      // Select the ungrouped elements
      this.selectedElementIds = [...groupElement.childIds]
      this.saveSnapshot()
    },

    // Ungroup currently selected group(s)
    ungroupSelectedElements() {
      const selectedGroups = this.elements.filter(
        (e: CanvasElement) =>
          this.selectedElementIds.includes(e.id) && e.type === 'group'
      )

      if (selectedGroups.length === 0) return

      // Collect all ungrouped element IDs
      const ungroupedIds: string[] = []

      selectedGroups.forEach((group) => {
        if (group.type === 'group') {
          const groupElement = group as GroupElement
          // Remove groupId from child elements
          groupElement.childIds.forEach((childId) => {
            const child = this.elements.find(
              (e: CanvasElement) => e.id === childId
            )
            if (child) {
              child.groupId = undefined
              ungroupedIds.push(childId)
            }
          })

          // Remove the group element
          const groupIndex = this.elements.findIndex(
            (e: CanvasElement) => e.id === group.id
          )
          if (groupIndex !== -1) {
            this.elements.splice(groupIndex, 1)
          }
        }
      })

      // Select the ungrouped elements
      this.selectedElementIds = ungroupedIds
      this.saveSnapshot()
    },

    copySelectedElement() {
      if (this.selectedElementIds.length === 0) return

      // Collect all elements to copy, including children of groups
      const elementsToCopy: CanvasElement[] = []

      this.selectedElementIds.forEach((id) => {
        const element = this.elements.find((e: CanvasElement) => e.id === id)
        if (element) {
          elementsToCopy.push(element)
          // If it's a group, also include its children
          if (element.type === 'group') {
            const groupElement = element as GroupElement
            groupElement.childIds.forEach((childId) => {
              const child = this.elements.find(
                (e: CanvasElement) => e.id === childId
              )
              if (child && !elementsToCopy.includes(child)) {
                elementsToCopy.push(child)
              }
            })
          }
        }
      })

      if (elementsToCopy.length > 0) {
        this.clipboard = JSON.parse(
          JSON.stringify(elementsToCopy)
        ) as CanvasElement[]
      }
    },

    pasteElement() {
      if (!this.clipboard || this.clipboard.length === 0) return

      const pastedElementIds: string[] = []
      const baseZIndex = this.elements.length

      // Create a mapping from old IDs to new IDs for proper group/child relationships
      const idMapping: Record<string, string> = {}

      // Sort clipboard elements by zIndex to preserve relative order
      const sortedClipboard = [...this.clipboard].sort(
        (a, b) => a.zIndex - b.zIndex
      )

      // First pass: create new IDs for all elements
      sortedClipboard.forEach((element) => {
        idMapping[element.id] = `${element.type}-${this.nextId++}`
      })

      // Second pass: paste all elements with remapped IDs
      sortedClipboard.forEach((clipboardElement, index) => {
        const pastedElement: CanvasElement = {
          ...JSON.parse(JSON.stringify(clipboardElement)),
          id: idMapping[clipboardElement.id]!,
          x: clipboardElement.x + 20,
          y: clipboardElement.y + 20,
          zIndex: baseZIndex + index,
        }

        // Remap groupId if element belongs to a group
        if (pastedElement.groupId && idMapping[pastedElement.groupId]) {
          pastedElement.groupId = idMapping[pastedElement.groupId]
        }

        // Remap childIds if element is a group
        if (pastedElement.type === 'group') {
          const groupEl = pastedElement as GroupElement
          groupEl.childIds = groupEl.childIds.map(
            (childId) => idMapping[childId] || childId
          )
        }

        this.elements.push(pastedElement)
        // Only add top-level elements (not grouped children) to selection
        if (!pastedElement.groupId) {
          pastedElementIds.push(pastedElement.id)
        }
      })

      // Update positions in clipboard for next paste
      this.clipboard.forEach((clipboardElement) => {
        clipboardElement.x += 20
        clipboardElement.y += 20
      })

      this.selectedElementIds = pastedElementIds
      this.saveSnapshot()
    },

    duplicateSelectedElement() {
      if (this.selectedElementIds.length === 0) return

      // Collect all elements to duplicate, including children of groups
      const elementsToDuplicate: CanvasElement[] = []

      this.selectedElementIds.forEach((id) => {
        const element = this.elements.find((e: CanvasElement) => e.id === id)
        if (element) {
          elementsToDuplicate.push(element)
          // If it's a group, also include its children
          if (element.type === 'group') {
            const groupElement = element as GroupElement
            groupElement.childIds.forEach((childId) => {
              const child = this.elements.find(
                (e: CanvasElement) => e.id === childId
              )
              if (child && !elementsToDuplicate.includes(child)) {
                elementsToDuplicate.push(child)
              }
            })
          }
        }
      })

      if (elementsToDuplicate.length === 0) return

      const duplicatedElementIds: string[] = []
      const baseZIndex = this.elements.length

      // Create a mapping from old IDs to new IDs
      const idMapping: Record<string, string> = {}
      elementsToDuplicate.forEach((element) => {
        idMapping[element.id] = `${element.type}-${this.nextId++}`
      })

      // Sort by zIndex to preserve relative order
      const sortedElements = [...elementsToDuplicate].sort(
        (a, b) => a.zIndex - b.zIndex
      )

      // Duplicate all elements with remapped IDs
      sortedElements.forEach((element, index) => {
        const duplicatedElement: CanvasElement = {
          ...JSON.parse(JSON.stringify(element)),
          id: idMapping[element.id]!,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: baseZIndex + index,
        }

        // Remap groupId if element belongs to a group
        if (duplicatedElement.groupId && idMapping[duplicatedElement.groupId]) {
          duplicatedElement.groupId = idMapping[duplicatedElement.groupId]
        }

        // Remap childIds if element is a group
        if (duplicatedElement.type === 'group') {
          const groupEl = duplicatedElement as GroupElement
          groupEl.childIds = groupEl.childIds.map(
            (childId) => idMapping[childId] || childId
          )
        }

        this.elements.push(duplicatedElement)
        // Only add top-level elements to selection
        if (!duplicatedElement.groupId) {
          duplicatedElementIds.push(duplicatedElement.id)
        }
      })

      this.selectedElementIds = duplicatedElementIds
      this.saveSnapshot()
    },

    // Note: Complex resize logic will be handled by components,
    // which will calculate the new x, y, width, height and call updateElement.
    // For simple dragging (translation), we can keep a dedicated action.
    updateElementPosition(id: string, deltaX: number, deltaY: number) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element) {
        element.x += deltaX
        element.y += deltaY

        // If it's a group, also move all children
        if (element.type === 'group') {
          const groupElement = element as GroupElement
          groupElement.childIds.forEach((childId) => {
            const child = this.elements.find(
              (e: CanvasElement) => e.id === childId
            )
            if (child) {
              child.x += deltaX
              child.y += deltaY
            }
          })
        }
      }
    },

    bringToFront() {
      if (this.selectedElementIds.length === 0) return

      // Collect all elements to move, including children of groups
      const elementsToMove: CanvasElement[] = []

      this.selectedElementIds.forEach((id) => {
        const element = this.elements.find((e: CanvasElement) => e.id === id)
        if (element) {
          elementsToMove.push(element)
          // If it's a group, also include its children
          if (element.type === 'group') {
            const groupElement = element as GroupElement
            groupElement.childIds.forEach((childId) => {
              const child = this.elements.find(
                (e: CanvasElement) => e.id === childId
              )
              if (child && !elementsToMove.includes(child)) {
                elementsToMove.push(child)
              }
            })
          }
        }
      })

      if (elementsToMove.length === 0) return

      const maxZIndex = Math.max(...this.elements.map((e) => e.zIndex))

      // Check if all elements are already at front
      const selectedMaxZIndex = Math.max(...elementsToMove.map((e) => e.zIndex))
      if (selectedMaxZIndex === maxZIndex) return

      // Sort elements by their current zIndex to maintain relative order
      elementsToMove.sort((a, b) => a.zIndex - b.zIndex)

      // Bring all elements to front, maintaining their relative order
      elementsToMove.forEach((element, index) => {
        element.zIndex = maxZIndex + 1 + index
      })

      this.saveSnapshot()
    },

    bringToBack() {
      if (this.selectedElementIds.length === 0) return

      // Collect all elements to move, including children of groups
      const elementsToMove: CanvasElement[] = []
      const idsToMove: string[] = []

      this.selectedElementIds.forEach((id) => {
        const element = this.elements.find((e: CanvasElement) => e.id === id)
        if (element) {
          elementsToMove.push(element)
          idsToMove.push(element.id)
          // If it's a group, also include its children
          if (element.type === 'group') {
            const groupElement = element as GroupElement
            groupElement.childIds.forEach((childId) => {
              const child = this.elements.find(
                (e: CanvasElement) => e.id === childId
              )
              if (child && !elementsToMove.includes(child)) {
                elementsToMove.push(child)
                idsToMove.push(child.id)
              }
            })
          }
        }
      })

      if (elementsToMove.length === 0) return

      // Check if all elements are already at back
      const minZIndex = Math.min(...this.elements.map((e) => e.zIndex))
      const selectedMinZIndex = Math.min(...elementsToMove.map((e) => e.zIndex))
      if (selectedMinZIndex === minZIndex) return

      // Sort elements by their current zIndex to maintain relative order
      elementsToMove.sort((a, b) => a.zIndex - b.zIndex)

      // Shift all non-selected elements up by the number of elements being moved
      this.elements.forEach((e: CanvasElement) => {
        if (!idsToMove.includes(e.id)) {
          e.zIndex += elementsToMove.length
        }
      })

      // Send all elements to back, maintaining their relative order
      elementsToMove.forEach((element, index) => {
        element.zIndex = index
      })

      this.saveSnapshot()
    },

    endDrag() {
      this.saveSnapshot()
    },

    endResize() {
      this.saveSnapshot()
    },

    clearAll() {
      this.elements = []
      this.selectedElementIds = []
      this.saveSnapshot()
    },

    exportSnapshot(): Snapshot {
      return {
        version: 1,
        timestamp: Date.now(),
        elements: JSON.parse(JSON.stringify(this.elements)),
        nextId: this.nextId,
      }
    },

    importSnapshot(data: unknown) {
      if (
        !data ||
        typeof data !== 'object' ||
        !('elements' in data) ||
        !Array.isArray((data as Snapshot).elements)
      ) {
        console.error('Invalid snapshot data')
        return
      }

      const snapshot = data as Snapshot

      this.elements = JSON.parse(JSON.stringify(snapshot.elements))
      this.nextId = snapshot.nextId || this.nextId
      this.selectedElementIds = []

      // Reset history
      this.history = [JSON.parse(JSON.stringify(this.elements))]
      this.historyIndex = 0
    },
  },
})
