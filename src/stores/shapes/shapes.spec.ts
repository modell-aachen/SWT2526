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
    it.each(['rectangle', 'triangle', 'trapezoid'] as const)(
      'adds a %s shape to the store',
      (type) => {
        const store = useShapesStore()
        store.addShape(type)

        expect(store.shapes).toHaveLength(1)
        expect(store.shapes[0]?.type).toBe(type)
      }
    )

    it('creates shape with default properties (pos, size, colors)', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      const shape = store.shapes[0]
      expect(shape?.x).toBe(100)
      expect(shape?.y).toBe(100)
      expect(shape?.width).toBe(100)
      expect(shape?.height).toBe(100)
      expect(shape?.outline).toBe('#000')
      expect(shape?.fill).toBe('transparent')
    })

    it('creates shape with custom position when provided', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 250, 300)

      expect(store.shapes[0]?.x).toBe(250)
      expect(store.shapes[0]?.y).toBe(300)
    })

    it('increments nextId for each shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      store.addShape('trapezoid')

      expect(store.shapes[0]?.id).toBe('rectangle-1')
      expect(store.shapes[1]?.id).toBe('triangle-2')
      expect(store.shapes[2]?.id).toBe('trapezoid-3')
    })

    it('sets the newly added shape as selected', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      expect(store.selectedShapeId).toBe('rectangle-1')
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

      store.selectShape(shapeId!)

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

  describe('updateShapeLink', () => {
    it('updates link property of a shape', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      const shapeId = store.shapes[0]?.id

      store.updateShapeLink(shapeId!, 'https://example.com')

      expect(store.shapes[0]?.link).toBe('https://example.com')
    })

    it('can remove link by passing undefined', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      const shapeId = store.shapes[0]?.id
      store.updateShapeLink(shapeId!, 'https://example.com')

      store.updateShapeLink(shapeId!, undefined)

      expect(store.shapes[0]?.link).toBeUndefined()
    })

    it('does nothing when shape id does not exist', () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      store.updateShapeLink('non-existent', 'https://example.com')

      expect(store.shapes[0]?.link).toBeUndefined()
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

  describe('sortedShapes', () => {
    it('returns shapes sorted by zIndex', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      store.addShape('trapezoid')

      const sorted = store.sortedShapes

      expect(sorted[0]?.zIndex).toBeLessThanOrEqual(sorted[1]?.zIndex as number)
      expect(sorted[1]?.zIndex).toBeLessThanOrEqual(sorted[2]?.zIndex as number)
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

  describe('undo/redo', () => {
    describe('undo', () => {
      it('restores previous state after addShape', () => {
        const store = useShapesStore()
        store.addShape('rectangle')

        store.undo()

        expect(store.shapes).toHaveLength(0)
      })

      it('restores previous state after deleteShape', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const shapeId = store.shapes[0]?.id
        store.deleteShape(shapeId!)

        store.undo()

        expect(store.shapes).toHaveLength(1)
        expect(store.shapes[0]?.id).toBe(shapeId)
      })

      it('restores previous state after clearAll', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.clearAll()

        store.undo()

        expect(store.shapes).toHaveLength(2)
      })

      it('restores previous state after rotateSelectedShape', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.rotateSelectedShape()

        expect(store.shapes[0]?.rotation).toBe(90)

        store.undo()

        expect(store.shapes[0]?.rotation).toBe(0)
      })

      it('can undo multiple times', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('trapezoid')

        store.undo()
        expect(store.shapes).toHaveLength(2)

        store.undo()
        expect(store.shapes).toHaveLength(1)

        store.undo()
        expect(store.shapes).toHaveLength(0)
      })

      it('does nothing when history is empty', () => {
        const store = useShapesStore()
        store.undo()
        expect(store.shapes).toHaveLength(0)
      })

      it('clears selection if selected shape no longer exists after undo', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const shapeId = store.shapes[0]?.id

        expect(store.selectedShapeId).toBe(shapeId)

        store.undo()

        expect(store.selectedShapeId).toBeNull()
      })

      it('preserves selection if selected shape still exists after undo', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const firstShapeId = store.shapes[0]?.id
        store.addShape('triangle')

        store.selectShape(firstShapeId!)
        store.undo()

        expect(store.selectedShapeId).toBe(firstShapeId)
      })
    })

    describe('redo', () => {
      it('restores state after undo', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const shapeId = store.shapes[0]?.id

        store.undo()
        expect(store.shapes).toHaveLength(0)

        store.redo()
        expect(store.shapes).toHaveLength(1)
        expect(store.shapes[0]?.id).toBe(shapeId)
      })

      it('can redo multiple times', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('trapezoid')

        store.undo()
        store.undo()
        store.undo()

        store.redo()
        expect(store.shapes).toHaveLength(1)

        store.redo()
        expect(store.shapes).toHaveLength(2)

        store.redo()
        expect(store.shapes).toHaveLength(3)
      })

      it('does nothing when at latest state', () => {
        const store = useShapesStore()
        store.addShape('rectangle')

        store.redo()

        expect(store.shapes).toHaveLength(1)
      })

      it('clears selection if selected shape no longer exists after redo', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const shapeId = store.shapes[0]?.id
        store.deleteShape(shapeId!)

        store.undo()
        store.selectShape(shapeId!)

        store.redo()

        expect(store.selectedShapeId).toBeNull()
      })
    })

    describe('branching history', () => {
      it('clears redo history when new action is performed after undo', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        store.undo()
        expect(store.canRedo).toBe(true)

        store.addShape('trapezoid')
        expect(store.canRedo).toBe(false)
      })

      it('creates new branch from undone state', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        store.undo()
        store.addShape('trapezoid')

        expect(store.shapes).toHaveLength(2)
        expect(store.shapes[0]?.type).toBe('rectangle')
        expect(store.shapes[1]?.type).toBe('trapezoid')
      })
    })

    describe('history cap', () => {
      it('limits history to 50 entries', () => {
        const store = useShapesStore()

        // Add 55 shapes to exceed the cap
        for (let i = 0; i < 55; i++) {
          store.addShape('rectangle')
        }

        // Should be capped at 50
        expect(store.history.length).toBeLessThanOrEqual(50)
      })

      it('still allows undo after hitting cap', () => {
        const store = useShapesStore()

        for (let i = 0; i < 55; i++) {
          store.addShape('rectangle')
        }

        // Should be able to undo multiple times
        store.undo()
        store.undo()
        store.undo()

        expect(store.shapes.length).toBe(52)
      })
    })

    describe('startDrag and startResize', () => {
      it('endDrag saves snapshot after drag operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const initialHistoryLength = store.history.length

        expect(store.history.length).toBe(initialHistoryLength) // no change yet

        store.endDrag()
        expect(store.history.length).toBe(initialHistoryLength + 1)
      })

      it('endResize saves snapshot after resize operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        const initialHistoryLength = store.history.length

        expect(store.history.length).toBe(initialHistoryLength) // no change yet

        store.endResize()
        expect(store.history.length).toBe(initialHistoryLength + 1)
      })

      it('allows undo of drag operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 100, 100)
        const shapeId = store.shapes[0]?.id

        store.updateShapePosition(shapeId!, 50, 50)
        store.endDrag()

        expect(store.shapes[0]?.x).toBe(150)
        expect(store.shapes[0]?.y).toBe(150)

        store.undo()

        expect(store.shapes[0]?.x).toBe(100)
        expect(store.shapes[0]?.y).toBe(100)
      })

      it('allows undo of resize operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 100, 100)
        const shapeId = store.shapes[0]?.id

        store.updateShapeSize(shapeId!, 'se', 50, 50)
        store.endResize()

        expect(store.shapes[0]?.width).toBe(150)
        expect(store.shapes[0]?.height).toBe(150)

        store.undo()

        expect(store.shapes[0]?.width).toBe(100)
        expect(store.shapes[0]?.height).toBe(100)
      })

      it('undo after add + move should restore position, not delete shape', () => {
        const store = useShapesStore()

        // Step 1: Add a shape
        store.addShape('rectangle', 100, 100)
        expect(store.shapes).toHaveLength(1)
        const shapeId = store.shapes[0]?.id

        // Step 2: Move it
        store.updateShapePosition(shapeId!, 50, 50)
        store.endDrag()
        expect(store.shapes[0]?.x).toBe(150)
        expect(store.shapes[0]?.y).toBe(150)

        // Step 3: Undo once - should restore original position, NOT delete shape
        store.undo()

        expect(store.shapes).toHaveLength(1)
        expect(store.shapes[0]?.x).toBe(100)
        expect(store.shapes[0]?.y).toBe(100)
      })

      it('redo after undo should restore moved position', () => {
        const store = useShapesStore()

        // Step 1: Add a shape
        store.addShape('rectangle', 100, 100)
        const shapeId = store.shapes[0]?.id

        // Step 2: Move it
        store.updateShapePosition(shapeId!, 50, 50)
        store.endDrag()
        expect(store.shapes[0]?.x).toBe(150)
        expect(store.shapes[0]?.y).toBe(150)

        // Step 3: Undo - should go back to original position
        store.undo()
        expect(store.shapes[0]?.x).toBe(100)
        expect(store.shapes[0]?.y).toBe(100)

        // Step 4: Redo - should restore the moved position
        store.redo()
        expect(store.shapes[0]?.x).toBe(150)
        expect(store.shapes[0]?.y).toBe(150)
      })

      it('redo after undo should restore resized dimensions', () => {
        const store = useShapesStore()

        // Step 1: Add a shape
        store.addShape('rectangle', 100, 100)
        const shapeId = store.shapes[0]?.id

        // Step 2: Resize it
        store.updateShapeSize(shapeId!, 'se', 50, 50)
        store.endResize()
        expect(store.shapes[0]?.width).toBe(150)
        expect(store.shapes[0]?.height).toBe(150)

        // Step 3: Undo - should go back to original size
        store.undo()
        expect(store.shapes[0]?.width).toBe(100)
        expect(store.shapes[0]?.height).toBe(100)

        // Step 4: Redo - should restore the resized dimensions
        store.redo()
        expect(store.shapes[0]?.width).toBe(150)
        expect(store.shapes[0]?.height).toBe(150)
      })
    })
  })

  describe('copy/paste', () => {
    describe('copySelectedShape', () => {
      it('does nothing when no shape is selected', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.selectShape(null)

        store.copySelectedShape()

        expect(store.clipboard).toBeNull()
      })

      it('stores a deep clone of selected shape in clipboard', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 150, 200)
        const shapeId = store.shapes[0]?.id

        store.selectShape(shapeId!)
        store.copySelectedShape()

        expect(store.clipboard).not.toBeNull()
        expect(store.clipboard?.type).toBe('rectangle')
        expect(store.clipboard?.x).toBe(150)
        expect(store.clipboard?.y).toBe(200)
      })

      it('clipboard is independent of original shape', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 100, 100)
        const shapeId = store.shapes[0]?.id

        store.selectShape(shapeId!)
        store.copySelectedShape()

        // Modify original shape
        store.updateShapePosition(shapeId!, 50, 50)

        // Clipboard should be unchanged
        expect(store.clipboard?.x).toBe(100)
        expect(store.clipboard?.y).toBe(100)
      })
    })

    describe('pasteShape', () => {
      it('does nothing when clipboard is empty', () => {
        const store = useShapesStore()

        store.pasteShape()

        expect(store.shapes).toHaveLength(0)
      })

      it('creates new shape with unique ID', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.copySelectedShape()

        store.pasteShape()

        expect(store.shapes).toHaveLength(2)
        expect(store.shapes[0]?.id).toBe('rectangle-1')
        expect(store.shapes[1]?.id).toBe('rectangle-2')
      })

      it('offsets position by 20px x and y', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 100, 100)
        store.copySelectedShape()

        store.pasteShape()

        expect(store.shapes[1]?.x).toBe(120)
        expect(store.shapes[1]?.y).toBe(120)
      })

      it('preserves shape properties (type, width, height, rotation, outline, fill)', () => {
        const store = useShapesStore()
        store.addShape('triangle', 100, 100)
        const shape = store.shapes[0]!
        shape.width = 200
        shape.height = 150
        shape.rotation = 90
        shape.outline = '#ff0000'
        shape.fill = '#00ff00'
        store.copySelectedShape()

        store.pasteShape()

        const pastedShape = store.shapes[1]!
        expect(pastedShape.type).toBe('triangle')
        expect(pastedShape.width).toBe(200)
        expect(pastedShape.height).toBe(150)
        expect(pastedShape.rotation).toBe(90)
        expect(pastedShape.outline).toBe('#ff0000')
        expect(pastedShape.fill).toBe('#00ff00')
      })

      it('auto-selects the pasted shape', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.copySelectedShape()

        store.pasteShape()

        expect(store.selectedShapeId).toBe('rectangle-2')
      })

      it('saves snapshot for undo support', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.copySelectedShape()
        const historyLengthBefore = store.history.length

        store.pasteShape()

        expect(store.history.length).toBe(historyLengthBefore + 1)
      })

      it('multiple pastes increment offset', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 100, 100)
        store.copySelectedShape()

        store.pasteShape()
        store.pasteShape()

        expect(store.shapes[1]?.x).toBe(120)
        expect(store.shapes[1]?.y).toBe(120)
        expect(store.shapes[2]?.x).toBe(140)
        expect(store.shapes[2]?.y).toBe(140)
      })

      it('assigns correct zIndex to pasted shape', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.selectShape(store.shapes[0]!.id)
        store.copySelectedShape()

        store.pasteShape()

        expect(store.shapes[2]?.zIndex).toBe(2)
      })
    })

    describe('undo/redo with paste', () => {
      it('allows undo of paste operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.copySelectedShape()
        store.pasteShape()

        expect(store.shapes).toHaveLength(2)

        store.undo()

        expect(store.shapes).toHaveLength(1)
      })

      it('allows redo of paste operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.copySelectedShape()
        store.pasteShape()
        store.undo()

        store.redo()

        expect(store.shapes).toHaveLength(2)
      })
    })
    describe('duplicateSelectedShape', () => {
      it('does nothing when no shape is selected', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.selectShape(null)

        store.duplicateSelectedShape()

        expect(store.shapes).toHaveLength(1)
      })

      it('creates a copy of the selected shape with offset', () => {
        const store = useShapesStore()
        store.addShape('rectangle', 100, 100)

        store.duplicateSelectedShape()

        expect(store.shapes).toHaveLength(2)
        expect(store.shapes[1]?.x).toBe(120)
        expect(store.shapes[1]?.y).toBe(120)
      })

      it('selects the duplicated shape', () => {
        const store = useShapesStore()
        store.addShape('rectangle')

        store.duplicateSelectedShape()

        expect(store.selectedShapeId).toBe('rectangle-2')
      })

      it('preserves shape properties', () => {
        const store = useShapesStore()
        store.addShape('triangle', 100, 100)
        const shape = store.shapes[0]!
        shape.width = 200
        shape.height = 150
        shape.rotation = 45
        shape.outline = '#ff0000'
        shape.fill = '#00ff00'

        store.duplicateSelectedShape()

        const duplicated = store.shapes[1]!
        expect(duplicated.type).toBe('triangle')
        expect(duplicated.width).toBe(200)
        expect(duplicated.height).toBe(150)
        expect(duplicated.rotation).toBe(45)
        expect(duplicated.outline).toBe('#ff0000')
        expect(duplicated.fill).toBe('#00ff00')
      })

      it('allows undo of duplicate operation', () => {
        const store = useShapesStore()
        store.addShape('rectangle')
        store.duplicateSelectedShape()

        expect(store.shapes).toHaveLength(2)

        store.undo()

        expect(store.shapes).toHaveLength(1)
      })
    })
  })
})
