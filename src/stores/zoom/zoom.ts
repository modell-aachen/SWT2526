import { defineStore } from 'pinia'

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
  },
})
