import { defineStore } from 'pinia'
import type { Shape } from '@/types/Shape'
import type { ShapeType } from '@/types/ShapeType'

const MAX_HISTORY_SIZE = 50

export const useShapesStore = defineStore('shapes', {
  state: () => ({
    shapes: [] as Shape[],
    selectedShapeId: null as string | null,
    nextId: 1,
    history: [[]] as Shape[][], // Start with empty state
    historyIndex: 0, // Points to current state in history
    clipboard: null as Shape | null, // Single shape clipboard for copy/paste
  }),

  getters: {
    selectedShape: (state) => {
      if (!state.selectedShapeId) return null
      return state.shapes.find((s) => s.id === state.selectedShapeId) || null
    },

    sortedShapes: (state): Shape[] => {
      return [...state.shapes].sort((a, b) => a.zIndex - b.zIndex)
    },

    canUndo: (state) => {
      return state.historyIndex > 0
    },

    canRedo: (state) => {
      return state.historyIndex < state.history.length - 1
    },

    hasCopiedShape: (state) => {
      return state.clipboard !== null
    },
  },

  actions: {
    saveSnapshot() {
      // Remove any future history if we're not at the end (branching)
      if (this.canRedo) {
        this.history = this.history.slice(0, this.historyIndex + 1)
      }

      // Deep clone the current shapes array and push as new state
      const snapshot = JSON.parse(JSON.stringify(this.shapes)) as Shape[]
      this.history.push(snapshot)
      this.historyIndex = this.history.length - 1

      // Cap history at MAX_HISTORY_SIZE
      if (this.history.length > MAX_HISTORY_SIZE) {
        this.history.shift()
        this.historyIndex = this.history.length - 1
      }
    },

    undo() {
      if (!this.canUndo) return

      this.historyIndex--
      this.shapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]))

      // Clear selection if the selected shape no longer exists
      if (
        this.selectedShapeId &&
        !this.shapes.find((s) => s.id === this.selectedShapeId)
      ) {
        this.selectedShapeId = null
      }
    },

    redo() {
      if (!this.canRedo) return

      this.historyIndex++
      this.shapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]))

      // Clear selection if the selected shape no longer exists
      if (
        this.selectedShapeId &&
        !this.shapes.find((s) => s.id === this.selectedShapeId)
      ) {
        this.selectedShapeId = null
      }
    },

    addShape(type: ShapeType, x: number = 100, y: number = 100) {
      const newShape: Shape = {
        id: `${type}-${this.nextId++}`,
        type,
        x,
        y,
        width: 100,
        height: 100,
        outline: '#000',
        fill: 'transparent',
        zIndex: this.shapes.length,
        rotation: 0,
        link: undefined,
      }
      this.shapes.push(newShape)
      this.selectedShapeId = newShape.id
      this.saveSnapshot()
    },

    deleteShape(id: string) {
      const index = this.shapes.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.shapes.splice(index, 1)
        if (this.selectedShapeId === id) {
          this.selectedShapeId = null
        }
        this.saveSnapshot()
      }
    },

    deleteSelectedShape() {
      if (this.selectedShapeId) {
        this.deleteShape(this.selectedShapeId)
      }
    },

    selectShape(id: string | null) {
      this.selectedShapeId = id
    },

    endDrag() {
      // Save snapshot at the end of drag operation
      this.saveSnapshot()
    },

    updateShapePosition(id: string, deltaX: number, deltaY: number) {
      const shape = this.shapes.find((s) => s.id === id)
      if (shape) {
        shape.x += deltaX
        shape.y += deltaY
      }
    },

    endResize() {
      // Save snapshot at the end of resize operation
      this.saveSnapshot()
    },

    updateShapeSize(
      id: string,
      handle: string,
      deltaX: number,
      deltaY: number
    ) {
      const shape = this.shapes.find((s) => s.id === id)
      if (!shape) return

      // Handle resize based on which handle is being dragged
      switch (handle) {
        case 'se': // Southeast - bottom right
          shape.width = Math.max(20, shape.width + deltaX)
          shape.height = Math.max(20, shape.height + deltaY)
          break
        case 'sw': // Southwest - bottom left
          shape.width = Math.max(20, shape.width - deltaX)
          shape.height = Math.max(20, shape.height + deltaY)
          shape.x += deltaX
          break
        case 'ne': // Northeast - top right
          shape.width = Math.max(20, shape.width + deltaX)
          shape.height = Math.max(20, shape.height - deltaY)
          shape.y += deltaY
          break
        case 'nw': // Northwest - top left<
          shape.width = Math.max(20, shape.width - deltaX)
          shape.height = Math.max(20, shape.height - deltaY)
          shape.x += deltaX
          shape.y += deltaY
          break
        case 'n': // North - top
          shape.height = Math.max(20, shape.height - deltaY)
          shape.y += deltaY
          break
        case 's': // South - bottom
          shape.height = Math.max(20, shape.height + deltaY)
          break
        case 'e': // East - right
          shape.width = Math.max(20, shape.width + deltaX)
          break
        case 'w': // West - left
          shape.width = Math.max(20, shape.width - deltaX)
          shape.x += deltaX
          break
      }
    },

    rotateSelectedShape() {
      if (!this.selectedShapeId) return
      const shape = this.shapes.find((s) => s.id === this.selectedShapeId)
      if (shape) {
        shape.rotation = (shape.rotation + 90) % 360
        this.saveSnapshot()
      }
    },

    clearAll() {
      this.shapes = []
      this.selectedShapeId = null
      this.saveSnapshot()
    },

    copySelectedShape() {
      if (!this.selectedShapeId) return
      const shape = this.shapes.find((s) => s.id === this.selectedShapeId)
      if (shape) {
        // Deep clone the shape to clipboard
        this.clipboard = JSON.parse(JSON.stringify(shape)) as Shape
      }
    },

    pasteShape() {
      if (!this.clipboard) return

      const pastedShape: Shape = {
        ...JSON.parse(JSON.stringify(this.clipboard)),
        id: `${this.clipboard.type}-${this.nextId++}`,
        x: this.clipboard.x + 20,
        y: this.clipboard.y + 20,
        zIndex: this.shapes.length,
      }

      this.shapes.push(pastedShape)
      this.selectedShapeId = pastedShape.id
      this.saveSnapshot()

      // Update clipboard position for subsequent pastes
      this.clipboard.x += 20
      this.clipboard.y += 20
    },

    //TODO(jwi): replace deep clone with a utility function (lodash)
    duplicateSelectedShape() {
      if (!this.selectedShapeId) return
      const pastedShape: Shape = {
        ...JSON.parse(
          JSON.stringify(
            JSON.parse(JSON.stringify(this.selectedShape)) as Shape
          )
        ),
        id: `${(JSON.parse(JSON.stringify(this.selectedShape)) as Shape).type}-${this.nextId++}`,
        x: (JSON.parse(JSON.stringify(this.selectedShape)) as Shape).x + 20,
        y: (JSON.parse(JSON.stringify(this.selectedShape)) as Shape).y + 20,
        zIndex: this.shapes.length,
      }

      this.shapes.push(pastedShape)
      this.selectedShapeId = pastedShape.id
      this.saveSnapshot()
    },
    updateShapeLink(id: string, link: string | undefined) {
      const shape = this.shapes.find((s) => s.id === id)
      if (shape) {
        shape.link = link
        this.saveSnapshot()
      }
    },

    removeShapeLink(id: string) {
      const shape = this.shapes.find((s) => s.id === id)
      if (shape) {
        shape.link = undefined
        this.saveSnapshot()
      }
    },
  },
})
