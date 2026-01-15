import { defineStore } from 'pinia'
import type { CanvasElement, ShapeElement, TextElement } from '@/types/Element'
import type { ShapeType } from '@/types/ShapeType'

const MAX_HISTORY_SIZE = 50

export const useElementsStore = defineStore('elements', {
  state: () => ({
    elements: [] as CanvasElement[],
    selectedElementId: null as string | null,
    nextId: 1,
    history: [[]] as CanvasElement[][],
    historyIndex: 0,
    clipboard: null as CanvasElement | null,
  }),

  getters: {
    selectedElement: (state) => {
      if (!state.selectedElementId) return null
      return (
        state.elements.find((e) => e.id === state.selectedElementId) || null
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
        !this.elements.find((e) => e.id === this.selectedElementId)
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
        !this.elements.find((e) => e.id === this.selectedElementId)
      ) {
        this.selectedElementId = null
      }
    },

    addElement(element: CanvasElement) {
      this.elements.push(element)
      this.selectedElementId = element.id
      this.saveSnapshot()
    },

    addShape(shapeType: ShapeType, x: number = 100, y: number = 100) {
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
      }
      this.addElement(newShape)
    },

    updateShapeOutlineColor(id: string, color: string) {
      const element = this.elements.find((e) => e.id === id)
      if (element && element.type === 'shape') {
        element.outline = color
        this.saveSnapshot()
      }
    },

    updateShapeFillColor(id: string, color: string) {
      const element = this.elements.find((e) => e.id === id)
      if (element && element.type === 'shape') {
        element.fill = color
        this.saveSnapshot()
      }
    },

    updateShapeStrokeWeight(id: string, weight: number) {
      const element = this.elements.find((e) => e.id === id)
      if (element && element.type === 'shape') {
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

    updateElement(id: string, updates: Partial<CanvasElement>) {
      const index = this.elements.findIndex((e) => e.id === id)
      if (index !== -1) {
        this.elements[index] = {
          ...this.elements[index],
          ...updates,
        } as CanvasElement
      }
    },

    deleteElement(id: string) {
      const index = this.elements.findIndex((e) => e.id === id)
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
      const element = this.elements.find((e) => e.id === this.selectedElementId)
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
      const element = this.elements.find((e) => e.id === this.selectedElementId)
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
      const element = this.elements.find((e) => e.id === id)
      if (element) {
        element.x += deltaX
        element.y += deltaY
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
      const element = this.elements.find((e) => e.id === id)
      if (element) {
        ;(element as any).link = link
        this.saveSnapshot()
      }
    },

    removeElementLink(id: string) {
      const element = this.elements.find((e) => e.id === id)
      if (element) {
        ;(element as any).link = undefined
        this.saveSnapshot()
      }
    },
  },
})
