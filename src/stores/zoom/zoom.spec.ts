import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useZoomStore } from './zoom'
import type { CanvasElement } from '@/types/Element'

describe('Zoom Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useZoomStore()
    expect(store.zoom).toBe(1)
  })

  it('zooms in', () => {
    const store = useZoomStore()
    store.zoomIn()
    expect(store.zoom).toBe(1.1)
  })

  it('zooms out', () => {
    const store = useZoomStore()
    store.zoomOut()
    expect(store.zoom).toBe(0.9)
  })

  it('does not zoom out below 0.1', () => {
    const store = useZoomStore()

    for (let i = 0; i < 15; i++) {
      store.zoomOut()
    }
    expect(store.zoom).toBe(0.1)
  })

  it('does not zoom in above 3', () => {
    const store = useZoomStore()

    for (let i = 0; i < 25; i++) {
      store.zoomIn()
    }
    expect(store.zoom).toBe(3)
  })

  it('resets zoom', () => {
    const store = useZoomStore()
    store.zoomIn()
    store.zoomIn()
    store.resetZoom()
    expect(store.zoom).toBe(1)
  })

  it('auto fits elements', () => {
    const store = useZoomStore()
    const elements = [
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 100, y: 100, width: 100, height: 100 },
    ] as CanvasElement[]
    store.autoFit(elements, 200, 200)
    expect(store.zoom).toBe(0.5)
  })
})
