import { defineStore } from 'pinia'
import type { Shape } from '@/types/Shape'
import type { ShapeType } from '@/types/ShapeType'

export const useShapesStore = defineStore('shapes', {
  state: () => ({
    shapes: [] as Shape[],
    selectedShapeId: null as string | null,
    nextId: 1,
  }),

  getters: {
    selectedShape: (state) => {
      if (!state.selectedShapeId) return null
      return state.shapes.find((s) => s.id === state.selectedShapeId) || null
    },

    sortedShapes: (state) => {
      return [...state.shapes].sort((a, b) => a.zIndex - b.zIndex)
    },
  },

  actions: {
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
      }
      this.shapes.push(newShape)
      this.selectedShapeId = newShape.id
    },

    deleteShape(id: string) {
      const index = this.shapes.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.shapes.splice(index, 1)
        if (this.selectedShapeId === id) {
          this.selectedShapeId = null
        }
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

    updateShapePosition(id: string, deltaX: number, deltaY: number) {
      const shape = this.shapes.find((s) => s.id === id)
      if (shape) {
        shape.x += deltaX
        shape.y += deltaY
      }
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
        case 'nw': // Northwest - top left
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

    clearAll() {
      this.shapes = []
      this.selectedShapeId = null
    },
  },
})
