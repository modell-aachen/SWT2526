import { defineStore } from 'pinia'
import type { Shape } from '@/types/Shape'
import type { ShapeType } from '@/types/ShapeType'

const MAX_HISTORY_SIZE = 50

export const useShapesStore = defineStore('shapes', {
  state: () => ({
    shapes: [] as Shape[],
    selectedShapeIds: [] as string[],
    nextId: 1,
    history: [[]] as Shape[][], // Start with empty state
    historyIndex: 0, // Points to current state in history
    clipboard: [] as Shape[], // Multiple shapes clipboard for copy/paste
  }),

  getters: {
    selectedShapes: (state) => {
      return state.shapes.filter((s) => state.selectedShapeIds.includes(s.id))
    },

    // Keep for backward compatibility / single-shape operations
    selectedShape: (state) => {
      if (state.selectedShapeIds.length === 0) return null
      return (
        state.shapes.find((s) => s.id === state.selectedShapeIds[0]) || null
      )
    },

    sortedShapes: (state) => {
      return [...state.shapes].sort((a, b) => a.zIndex - b.zIndex)
    },

    canUndo: (state) => {
      return state.historyIndex > 0
    },

    canRedo: (state) => {
      return state.historyIndex < state.history.length - 1
    },

    hasCopiedShapes: (state) => {
      return state.clipboard.length > 0
    },

    hasSelection: (state) => {
      return state.selectedShapeIds.length > 0
    },

    hasMultipleSelected: (state) => {
      return state.selectedShapeIds.length > 1
    },

    isSelected: (state) => {
      return (id: string) => state.selectedShapeIds.includes(id)
    },

    // Get bounding box of all selected shapes
    selectionBounds: (state) => {
      const selected = state.shapes.filter((s) =>
        state.selectedShapeIds.includes(s.id)
      )
      if (selected.length === 0) return null

      const minX = Math.min(...selected.map((s) => s.x))
      const minY = Math.min(...selected.map((s) => s.y))
      const maxX = Math.max(...selected.map((s) => s.x + s.width))
      const maxY = Math.max(...selected.map((s) => s.y + s.height))

      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
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

      // Filter out selected shapes that no longer exist
      this.selectedShapeIds = this.selectedShapeIds.filter((id) =>
        this.shapes.some((s) => s.id === id)
      )
    },

    redo() {
      if (!this.canRedo) return

      this.historyIndex++
      this.shapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]))

      // Filter out selected shapes that no longer exist
      this.selectedShapeIds = this.selectedShapeIds.filter((id) =>
        this.shapes.some((s) => s.id === id)
      )
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
      }
      this.shapes.push(newShape)
      this.selectedShapeIds = [newShape.id]
      this.saveSnapshot()
    },

    deleteShape(id: string) {
      const index = this.shapes.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.shapes.splice(index, 1)
        this.selectedShapeIds = this.selectedShapeIds.filter(
          (selectedId) => selectedId !== id
        )
        this.saveSnapshot()
      }
    },

    deleteSelectedShapes() {
      if (this.selectedShapeIds.length === 0) return

      // Remove all selected shapes
      this.shapes = this.shapes.filter(
        (s) => !this.selectedShapeIds.includes(s.id)
      )
      this.selectedShapeIds = []
      this.saveSnapshot()
    },

    // Selection modes: 'replace' (default), 'toggle', 'add'
    selectShape(
      id: string | null,
      mode: 'replace' | 'toggle' | 'add' = 'replace'
    ) {
      if (id === null) {
        this.selectedShapeIds = []
        return
      }

      switch (mode) {
        case 'replace':
          this.selectedShapeIds = [id]
          break
        case 'toggle':
          if (this.selectedShapeIds.includes(id)) {
            this.selectedShapeIds = this.selectedShapeIds.filter(
              (selectedId) => selectedId !== id
            )
          } else {
            this.selectedShapeIds = [...this.selectedShapeIds, id]
          }
          break
        case 'add':
          if (!this.selectedShapeIds.includes(id)) {
            this.selectedShapeIds = [...this.selectedShapeIds, id]
          }
          break
      }
    },

    selectShapes(ids: string[]) {
      this.selectedShapeIds = ids
    },

    selectAll() {
      this.selectedShapeIds = this.shapes.map((s) => s.id)
    },

    clearSelection() {
      this.selectedShapeIds = []
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

    // Move all selected shapes together
    updateSelectedShapesPosition(deltaX: number, deltaY: number) {
      for (const id of this.selectedShapeIds) {
        const shape = this.shapes.find((s) => s.id === id)
        if (shape) {
          shape.x += deltaX
          shape.y += deltaY
        }
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

    rotateSelectedShapes() {
      if (this.selectedShapeIds.length === 0) return
      for (const id of this.selectedShapeIds) {
        const shape = this.shapes.find((s) => s.id === id)
        if (shape) {
          shape.rotation = (shape.rotation + 90) % 360
        }
      }
      this.saveSnapshot()
    },

    clearAll() {
      this.shapes = []
      this.selectedShapeIds = []
      this.saveSnapshot()
    },

    copySelectedShapes() {
      if (this.selectedShapeIds.length === 0) return
      // Deep clone all selected shapes to clipboard
      this.clipboard = JSON.parse(
        JSON.stringify(this.selectedShapes)
      ) as Shape[]
    },

    pasteShapes() {
      if (this.clipboard.length === 0) return

      const newIds: string[] = []

      for (const clipboardShape of this.clipboard) {
        const pastedShape: Shape = {
          ...JSON.parse(JSON.stringify(clipboardShape)),
          id: `${clipboardShape.type}-${this.nextId++}`,
          x: clipboardShape.x + 20,
          y: clipboardShape.y + 20,
          zIndex: this.shapes.length,
        }
        this.shapes.push(pastedShape)
        newIds.push(pastedShape.id)
      }

      this.selectedShapeIds = newIds
      this.saveSnapshot()

      // Update clipboard positions for subsequent pastes
      for (const shape of this.clipboard) {
        shape.x += 20
        shape.y += 20
      }
    },

    duplicateSelectedShapes() {
      if (this.selectedShapeIds.length === 0) return

      const shapesToDuplicate = JSON.parse(
        JSON.stringify(this.selectedShapes)
      ) as Shape[]
      const newIds: string[] = []

      for (const shape of shapesToDuplicate) {
        const duplicatedShape: Shape = {
          ...shape,
          id: `${shape.type}-${this.nextId++}`,
          x: shape.x + 20,
          y: shape.y + 20,
          zIndex: this.shapes.length,
        }
        this.shapes.push(duplicatedShape)
        newIds.push(duplicatedShape.id)
      }

      this.selectedShapeIds = newIds
      this.saveSnapshot()
    },
  },
})
