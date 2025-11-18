import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShapesStore } from './shapes'

describe('useShapesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts with empty shapes array', () => {
      const store = useShapesStore()
      expect(store.shapes).toEqual([])
    })

    it('starts with no selected shape', () => {
      const store = useShapesStore()
      expect(store.selectedShapeId).toBeNull()
    })

    it('starts with nextId of 1', () => {
      const store = useShapesStore()
      expect(store.nextId).toBe(1)
    })
  })

  describe('addShape', () => {
    it('adds a rectangle shape to the store', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      expect(store.shapes).toHaveLength(1)
      expect(store.shapes[0]?.type).toBe('rectangle')
    })

    it('adds a triangle shape to the store', () => {
      const store = useShapesStore()
      store.addShape('triangle')

      expect(store.shapes).toHaveLength(1)
      expect(store.shapes[0]?.type).toBe('triangle')
    })

    it('adds a trapezoid shape to the store', () => {
      const store = useShapesStore()
      store.addShape('trapezoid')

      expect(store.shapes).toHaveLength(1)
      expect(store.shapes[0]?.type).toBe('trapezoid')
    })

    it('creates shape with default position when not provided', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      expect(store.shapes[0]?.x).toBe(100)
      expect(store.shapes[0]?.y).toBe(100)
    })

    it('creates shape with custom position when provided', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 250, 300)

      expect(store.shapes[0]?.x).toBe(250)
      expect(store.shapes[0]?.y).toBe(300)
    })

    it('creates shape with default size of 100x100', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      expect(store.shapes[0]?.width).toBe(100)
      expect(store.shapes[0]?.height).toBe(100)
    })

    it('creates shape with default colors', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      expect(store.shapes[0]?.outline).toBe('#000')
      expect(store.shapes[0]?.fill).toBe('transparent')
    })

    it('increments nextId for each shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      store.addShape('trapezoid')

      expect(store.shapes[0]?.id).toBe('shape-1')
      expect(store.shapes[1]?.id).toBe('shape-2')
      expect(store.shapes[2]?.id).toBe('shape-3')
    })

    it('sets the newly added shape as selected', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      expect(store.selectedShapeId).toBe('shape-1')
    })

    it('sets correct zIndex based on array length', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      expect(store.shapes[0]?.zIndex).toBe(0)
      expect(store.shapes[1]?.zIndex).toBe(1)
    })
  })

  describe('deleteShape', () => {
    it('removes a shape by id', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      const shapeId = store.shapes[0]?.id

      store.deleteShape(shapeId!)

      expect(store.shapes).toHaveLength(0)
    })

    it('clears selectedShapeId when deleting selected shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      const shapeId = store.shapes[0]?.id

      store.deleteShape(shapeId!)

      expect(store.selectedShapeId).toBeNull()
    })

    it('keeps selectedShapeId when deleting non-selected shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      const firstShapeId = store.shapes[0]?.id

      store.selectShape(store.shapes[1]!.id)
      store.deleteShape(firstShapeId!)

      expect(store.selectedShapeId).toBe(store.shapes[0]?.id)
    })

    it('does nothing when deleting non-existent shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      store.deleteShape('non-existent-id')

      expect(store.shapes).toHaveLength(1)
    })
  })

  describe('deleteSelectedShape', () => {
    it('deletes the currently selected shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      store.deleteSelectedShape()

      expect(store.shapes).toHaveLength(0)
      expect(store.selectedShapeId).toBeNull()
    })

    it('does nothing when no shape is selected', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.selectShape(null)

      store.deleteSelectedShape()

      expect(store.shapes).toHaveLength(1)
    })
  })

  describe('selectShape', () => {
    it('sets the selected shape id', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      const shapeId = store.shapes[0]?.id

      store.selectShape(shapeId)

      expect(store.selectedShapeId).toBe(shapeId)
    })

    it('can deselect by passing null', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.selectShape(null)

      expect(store.selectedShapeId).toBeNull()
    })
  })

  describe('updateShapePosition', () => {
    it('updates shape position with positive deltas', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapePosition(shapeId!, 50, 30)

      expect(store.shapes[0]?.x).toBe(150)
      expect(store.shapes[0]?.y).toBe(130)
    })

    it('updates shape position with negative deltas', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapePosition(shapeId!, -20, -40)

      expect(store.shapes[0]?.x).toBe(80)
      expect(store.shapes[0]?.y).toBe(60)
    })

    it('does nothing when shape id does not exist', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)

      store.updateShapePosition('non-existent', 50, 30)

      expect(store.shapes[0]?.x).toBe(100)
      expect(store.shapes[0]?.y).toBe(100)
    })
  })

  describe('updateShapeSize', () => {
    it('resizes from southeast handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'se', 30, 40)

      expect(store.shapes[0]?.width).toBe(130)
      expect(store.shapes[0]?.height).toBe(140)
      expect(store.shapes[0]?.x).toBe(100)
      expect(store.shapes[0]?.y).toBe(100)
    })

    it('resizes from southwest handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'sw', -30, 40)

      expect(store.shapes[0]?.width).toBe(130)
      expect(store.shapes[0]?.height).toBe(140)
      expect(store.shapes[0]?.x).toBe(70)
      expect(store.shapes[0]?.y).toBe(100)
    })

    it('resizes from northeast handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'ne', 30, -20)

      expect(store.shapes[0]?.width).toBe(130)
      expect(store.shapes[0]?.height).toBe(120)
      expect(store.shapes[0]?.x).toBe(100)
      expect(store.shapes[0]?.y).toBe(80)
    })

    it('resizes from northwest handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'nw', -20, -30)

      expect(store.shapes[0]?.width).toBe(120)
      expect(store.shapes[0]?.height).toBe(130)
      expect(store.shapes[0]?.x).toBe(80)
      expect(store.shapes[0]?.y).toBe(70)
    })

    it('resizes from north handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'n', 0, -25)

      expect(store.shapes[0]?.height).toBe(125)
      expect(store.shapes[0]?.y).toBe(75)
      expect(store.shapes[0]?.width).toBe(100)
    })

    it('resizes from south handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 's', 0, 35)

      expect(store.shapes[0]?.height).toBe(135)
      expect(store.shapes[0]?.y).toBe(100)
    })

    it('resizes from east handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'e', 45, 0)

      expect(store.shapes[0]?.width).toBe(145)
      expect(store.shapes[0]?.x).toBe(100)
    })

    it('resizes from west handle', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'w', -40, 0)

      expect(store.shapes[0]?.width).toBe(140)
      expect(store.shapes[0]?.x).toBe(60)
    })

    it('enforces minimum size of 20px', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)
      const shapeId = store.shapes[0]?.id

      store.updateShapeSize(shapeId!, 'se', -200, -200)

      expect(store.shapes[0]?.width).toBe(20)
      expect(store.shapes[0]?.height).toBe(20)
    })

    it('does nothing when shape id does not exist', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)

      store.updateShapeSize('non-existent', 'se', 50, 50)

      expect(store.shapes[0]?.width).toBe(100)
      expect(store.shapes[0]?.height).toBe(100)
    })
  })

  describe('clearAll', () => {
    it('removes all shapes', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      store.addShape('trapezoid')

      store.clearAll()

      expect(store.shapes).toEqual([])
    })

    it('clears selected shape id', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      store.clearAll()

      expect(store.selectedShapeId).toBeNull()
    })
  })

  describe('getters', () => {
    describe('selectedShape', () => {
      it('returns the selected shape object', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const shapeId = store.shapes[0]?.id

        expect(store.selectedShape).toEqual(store.shapes[0])
        expect(store.selectedShape?.id).toBe(shapeId)
      })

      it('returns null when no shape is selected', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.selectShape(null)

        expect(store.selectedShape).toBeNull()
      })

      it('returns null when selected id does not exist', () => {
        const store = useShapesStore()
        store.selectedShapeId = 'non-existent'

        expect(store.selectedShape).toBeNull()
      })
    })

    describe('sortedShapes', () => {
      it('returns shapes sorted by zIndex', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('trapezoid')

        const sorted = store.sortedShapes

        expect(sorted[0]?.zIndex).toBeLessThanOrEqual(sorted[1]?.zIndex)
        expect(sorted[1]?.zIndex).toBeLessThanOrEqual(sorted[2]?.zIndex)
      })

      it('does not mutate original shapes array', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        const originalOrder = [...store.shapes]

        const _ = store.sortedShapes

        expect(store.shapes).toEqual(originalOrder)
      })
    })
  })
})
