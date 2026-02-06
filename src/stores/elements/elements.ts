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
  clipboard: CanvasElement | null
  customShapes: { name: string; points: string }[]
}

export const useElementsStore = defineStore('elements', {
  state: (): ElementsState => ({
    elements: [],
    selectedElementIds: [], // Changed to array for multi-selection
    nextId: 1,
    history: [[]],
    historyIndex: 0,
    clipboard: null,
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
    hasCopiedElement: (state) => state.clipboard !== null,
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

    updateShapeOutlineColor(id: string, color: string) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element && element.type === 'shape') {
        element.outline = color
        this.saveSnapshot()
      }
    },

    updateShapeFillColor(id: string, color: string) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element && element.type === 'shape') {
        element.fill = color
        this.saveSnapshot()
      }
    },

    updateShapeStrokeWeight(id: string, weight: number) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element && element.type === 'shape' && weight >= 0) {
        element.strokeWeight = weight
        this.saveSnapshot()
      }
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

    updateIconColor(id: string, color: string) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element && element.type === 'icon') {
        element.color = color
        this.saveSnapshot()
      }
    },

    updateIconStrokeWeight(id: string, weight: number) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element && element.type === 'icon' && weight >= 0) {
        element.strokeWeight = weight
        this.saveSnapshot()
      }
    },

    updateElement(id: string, updates: Partial<CanvasElement>) {
      const index = this.elements.findIndex((e: CanvasElement) => e.id === id)
      if (index !== -1) {
        this.elements[index] = {
          ...this.elements[index],
          ...updates,
        } as CanvasElement
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
      // Delete all selected elements
      this.selectedElementIds.forEach((id) => {
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

      // Get selected elements that are not already in a group
      const elementsToGroup = this.elements.filter(
        (e: CanvasElement) =>
          this.selectedElementIds.includes(e.id) && !e.groupId
      )

      if (elementsToGroup.length < 2) return

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
      const element = this.elements.find(
        (e: CanvasElement) => e.id === this.selectedElementIds[0]
      )
      if (element) {
        this.clipboard = JSON.parse(JSON.stringify(element)) as CanvasElement
      }
    },

    pasteElement() {
      if (!this.clipboard) return

      const pastedElement: CanvasElement = {
        ...JSON.parse(JSON.stringify(this.clipboard)),
        id: `${this.clipboard.type}-${this.nextId++}`,
        x: this.clipboard.x + 20,
        y: this.clipboard.y + 20,
        zIndex: this.elements.length,
      }

      this.elements.push(pastedElement)
      this.selectedElementIds = [pastedElement.id]
      this.saveSnapshot()

      this.clipboard.x += 20
      this.clipboard.y += 20
    },

    duplicateSelectedElement() {
      if (this.selectedElementIds.length === 0) return
      const element = this.elements.find(
        (e: CanvasElement) => e.id === this.selectedElementIds[0]
      )
      if (!element) return

      const duplicatedElement: CanvasElement = {
        ...JSON.parse(JSON.stringify(element)),
        id: `${element.type}-${this.nextId++}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: this.elements.length,
      }

      this.elements.push(duplicatedElement)
      this.selectedElementIds = [duplicatedElement.id]
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
      }
    },

    bringToFront() {
      if (this.selectedElementIds.length === 0) return
      const element = this.elements.find(
        (e: CanvasElement) => e.id === this.selectedElementIds[0]
      )
      if (!element) return

      const maxZIndex = Math.max(...this.elements.map((e) => e.zIndex))
      if (element.zIndex === maxZIndex) return // Already at front

      element.zIndex = maxZIndex + 1
      this.saveSnapshot()
    },

    bringToBack() {
      if (this.selectedElementIds.length === 0) return
      const element = this.elements.find(
        (e: CanvasElement) => e.id === this.selectedElementIds[0]
      )
      if (!element) return

      const minZIndex = Math.min(...this.elements.map((e) => e.zIndex))
      if (element.zIndex === minZIndex) return // Already at back

      // Shift all other elements up by 1
      this.elements.forEach((e: CanvasElement) => {
        if (!this.selectedElementIds.includes(e.id)) {
          e.zIndex += 1
        }
      })
      element.zIndex = 0
      this.saveSnapshot()
    },

    setElementPosition(id: string, x: number, y: number) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element) {
        element.x = x
        element.y = y
        this.saveSnapshot()
      }
    },

    updateTextElement(id: string, updates: Partial<TextElement>) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      // Create a new object to avoid direct mutation issues and ensure reactivity
      const updatedElement = { ...element, ...updates }
      const index = this.elements.findIndex((e: CanvasElement) => e.id === id)
      if (index !== -1) {
        this.elements[index] = updatedElement as CanvasElement
        this.saveSnapshot()
      }
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

    updateElementLink(id: string, link: string | undefined) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element) {
        element.link = link
        this.saveSnapshot()
      }
    },

    removeElementLink(id: string) {
      const element = this.elements.find((e: CanvasElement) => e.id === id)
      if (element) {
        element.link = undefined
        this.saveSnapshot()
      }
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
