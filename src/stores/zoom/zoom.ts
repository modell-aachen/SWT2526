import { defineStore } from 'pinia'
import type { CanvasElement } from '@/types/Element'

export const useZoomStore = defineStore('zoom', {
  state: () => ({
    zoom: 1.0, // 1.0 = 100%
  }),

  getters: {
    zoomPercentage: (state) => Math.round(state.zoom * 100),
  },

  actions: {
    zoomIn() {
      if (this.zoom < 3.0) {
        // Max zoom 300%
        this.zoom = Math.min(this.zoom + 0.1, 3.0)
      }
    },

    zoomOut() {
      if (this.zoom > 0.1) {
        // Min zoom 10%
        this.zoom = Math.max(this.zoom - 0.1, 0.1)
      }
    },

    setZoom(zoom: number) {
      this.zoom = Math.max(0.1, Math.min(3.0, zoom))
    },

    resetZoom() {
      this.zoom = 1.0
    },

    autoFit(
      elements: CanvasElement[],
      viewportWidth: number,
      viewportHeight: number,
      padding = 50
    ) {
      if (elements.length === 0) {
        this.resetZoom()
        return
      }

      // Calculate bounding box of all elements
      const minX = Math.min(...elements.map((e) => e.x))
      const minY = Math.min(...elements.map((e) => e.y))
      const maxX = Math.max(...elements.map((e) => e.x + e.width))
      const maxY = Math.max(...elements.map((e) => e.y + e.height))

      const contentWidth = maxX - minX
      const contentHeight = maxY - minY

      // Calculate zoom to fit with padding
      const zoomX = (viewportWidth - padding * 2) / contentWidth
      const zoomY = (viewportHeight - padding * 2) / contentHeight
      const optimalZoom = Math.min(zoomX, zoomY, 3.0) // Don't exceed max zoom

      this.setZoom(Math.max(0.1, optimalZoom))
    },
  },
})
