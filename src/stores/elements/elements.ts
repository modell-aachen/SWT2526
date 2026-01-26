import { defineStore } from 'pinia'
import type {
  CanvasElement,
  ShapeElement,
  TextElement,
  IconElement,
} from '@/types/Element'
import type { ShapeType } from '@/types/ShapeType'

const MAX_HISTORY_SIZE = 50

interface ElementsState {
  elements: CanvasElement[]
  selectedElementId: string | null
  nextId: number
  history: CanvasElement[][]
  historyIndex: number
  clipboard: CanvasElement | null
  customShapes: { name: string; points: string }[]
}

export const useElementsStore = defineStore('elements', {
  state: (): ElementsState => ({
    elements: [],
    selectedElementId: null,
    nextId: 1,
    history: [[]],
    historyIndex: 0,
    clipboard: null,
    customShapes: [],
  }),

  getters: {
    selectedElement: (state) => {
      if (!state.selectedElementId) return null
      return (
        state.elements.find(
          (e: CanvasElement) => e.id === state.selectedElementId
        ) || null
      )
    },

    sortedElements: (state): CanvasElement[] => {
      return [...state.elements].sort((a, b) => a.zIndex - b.zIndex)
    },

    canUndo: (state) => state.historyIndex > 0,
    canRedo: (state) => state.historyIndex < state.history.length - 1,
    hasCopiedElement: (state) => state.clipboard !== null,
  },

  actions: {
    saveCustomShape(name: string, points: string) {
      this.customShapes.push({ name, points })
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

      if (
        this.selectedElementId &&
        !this.elements.find(
          (e: CanvasElement) => e.id === this.selectedElementId
        )
      ) {
        this.selectedElementId = null
      }
    },

    redo() {
      if (!this.canRedo) return

      this.historyIndex++
      this.elements = JSON.parse(
        JSON.stringify(this.history[this.historyIndex])
      )

      if (
        this.selectedElementId &&
        !this.elements.find(
          (e: CanvasElement) => e.id === this.selectedElementId
        )
      ) {
        this.selectedElementId = null
      }
    },

    addElement(element: CanvasElement) {
      this.elements.push(element)
      this.selectedElementId = element.id
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
        if (this.selectedElementId === id) {
          this.selectedElementId = null
        }
        this.saveSnapshot()
      }
    },

    deleteSelectedElement() {
      if (this.selectedElementId) {
        this.deleteElement(this.selectedElementId)
      }
    },

    selectElement(id: string | null) {
      this.selectedElementId = id
    },

    copySelectedElement() {
      if (!this.selectedElementId) return
      const element = this.elements.find(
        (e: CanvasElement) => e.id === this.selectedElementId
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
      this.selectedElementId = pastedElement.id
      this.saveSnapshot()

      this.clipboard.x += 20
      this.clipboard.y += 20
    },

    duplicateSelectedElement() {
      if (!this.selectedElementId) return
      const element = this.elements.find(
        (e: CanvasElement) => e.id === this.selectedElementId
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
      this.selectedElementId = duplicatedElement.id
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
      this.selectedElementId = null
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
  },
})
