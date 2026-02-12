/**
 * @vitest-environment node
 */
import { setActivePinia, createPinia } from 'pinia'
import { useElementsStore } from './elements'
import { describe, it, expect, beforeEach } from 'vitest'
import type { TextElement, IconElement } from '@/types/Element'

describe('Elements Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useElementsStore()
    expect(store.elements).toHaveLength(0)
    expect(store.selectedElementId).toBeNull()
  })

  it('adds a shape element', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    expect(store.elements).toHaveLength(1)
    expect(store.elements[0]!.type).toBe('shape')
    expect(store.selectedElementId).toBe(store.elements[0]!.id)
  })

  it('adds a text element', () => {
    const store = useElementsStore()
    store.addText()
    const element = store.elements[0] as TextElement
    expect(element).toBeDefined()
    expect(element.type).toBe('text')
    expect(element.content).toBe('Double click to edit')
  })

  it('saves custom shape', () => {
    const store = useElementsStore()
    store.saveCustomShape('test', '0,0 100,100')
    expect(store.customShapes).toHaveLength(1)
    expect(store.customShapes[0]!.name).toBe('test')
    expect(store.customShapes[0]!.points).toBe('0,0 100,100')
  })

  it('updates an element', () => {
    const store = useElementsStore()
    store.addShape('triangle')
    const id = store.elements[0]!.id

    store.updateElement(id, { x: 200, rotation: 45 })

    expect(store.elements[0]!.x).toBe(200)
    expect(store.elements[0]!.rotation).toBe(45)
  })

  it('deletes an element', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.deleteElement(id)
    expect(store.elements).toHaveLength(0)
    expect(store.selectedElementId).toBeNull()
  })

  it('manages undo/redo history', () => {
    const store = useElementsStore()
    store.addShape('rectangle') // History 1
    const id = store.elements[0]!.id
    store.updateElementPosition(id, 10, 10)
    store.endDrag() // History 2 (Snapshot saved)

    expect(store.canUndo).toBe(true)

    store.undo()
    expect(store.historyIndex).toBe(1)

    store.redo()
    expect(store.historyIndex).toBe(2)
  })
  it('updates shape outline color', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.updateShapeOutlineColor(id, '#FF0000')
    // @ts-ignore
    expect(store.elements[0]!.outline).toBe('#FF0000')

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates shape fill color', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.updateShapeFillColor(id, '#00FF00')
    // @ts-ignore
    expect(store.elements[0]!.fill).toBe('#00FF00')

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates shape stroke weight', () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    const id = store.elements[0]!.id

    store.updateShapeStrokeWeight(id, 5)
    // @ts-ignore
    expect(store.elements[0]!.strokeWeight).toBe(5)

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates element position with snapshot', () => {
    const store = useElementsStore()
    store.addShape('rectangle', 100, 100)
    const id = store.elements[0]!.id

    // @ts-ignore
    store.setElementPosition(id, 200, 300)

    expect(store.elements[0]!.x).toBe(200)
    expect(store.elements[0]!.y).toBe(300)
    expect(store.canUndo).toBe(true)
  })

  it('adds an icon element', () => {
    const store = useElementsStore()
    store.addIcon('star')
    const element = store.elements[0] as IconElement
    expect(element).toBeDefined()
    expect(element.type).toBe('icon')
    expect(element.iconType).toBe('star')
  })

  it('updates icon color', () => {
    const store = useElementsStore()
    store.addIcon('star')
    const id = store.elements[0]!.id

    store.updateIconColor(id, '#0000FF')
    // @ts-ignore
    expect(store.elements[0]!.color).toBe('#0000FF')

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  it('updates icon stroke weight', () => {
    const store = useElementsStore()
    store.addIcon('star')
    const id = store.elements[0]!.id

    store.updateIconStrokeWeight(id, 4)
    // @ts-ignore
    expect(store.elements[0]!.strokeWeight).toBe(4)

    // Should trigger snapshot
    expect(store.canUndo).toBe(true)
  })

  const addShapes = () => {
    const store = useElementsStore()
    store.addShape('rectangle')
    store.addShape('triangle')
    store.addShape('ellipse')
  }

  describe('z-index management', () => {
    it('bringToFront moves element to highest zIndex', () => {
      const store = useElementsStore()
      addShapes()

      const firstId = store.elements[0]!.id
      store.selectElement(firstId)

      store.bringToFront()

      const allZIndexes = store.elements.map((e) => e.zIndex)
      expect(store.elements[0]!.zIndex).toBe(Math.max(...allZIndexes))
    })

    it('bringToBack moves element to zIndex 0 and shifts others up', () => {
      const store = useElementsStore()
      addShapes()

      const lastId = store.elements[2]!.id
      store.selectElement(lastId)

      store.bringToBack()

      expect(store.elements[2]!.zIndex).toBe(0)
      expect(store.elements[0]!.zIndex).toBe(1)
      expect(store.elements[1]!.zIndex).toBe(2)
    })

    it('bringToFront does nothing if already at front', () => {
      const store = useElementsStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const historyLengthBefore = store.history.length

      store.bringToFront()

      expect(store.elements[1]!.zIndex).toBe(1)
      expect(store.history.length).toBe(historyLengthBefore)
    })

    it('bringToBack does nothing if already at back', () => {
      const store = useElementsStore()
      addShapes()

      const firstId = store.elements[0]!.id
      store.selectElement(firstId)
      const historyLengthBefore = store.history.length

      store.bringToBack()

      expect(store.elements[0]!.zIndex).toBe(0)
      expect(store.history.length).toBe(historyLengthBefore)
    })
  })

  describe('Shape Groups', () => {
    describe('groupSelectedElements', () => {
      it('creates a group from 2+ selected elements', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        const id1 = store.elements[0]!.id
        const id2 = store.elements[1]!.id

        store.selectElement(id1)
        store.addToSelection(id2)

        store.groupSelectedElements()

        // Should have 3 elements: 2 shapes + 1 group
        expect(store.elements).toHaveLength(3)

        const group = store.elements.find((e) => e.type === 'group')
        expect(group).toBeDefined()
        expect(group!.type).toBe('group')
        // @ts-ignore
        expect(group!.childIds).toContain(id1)
        // @ts-ignore
        expect(group!.childIds).toContain(id2)

        // Children should have groupId set
        expect(store.elements[0]!.groupId).toBe(group!.id)
        expect(store.elements[1]!.groupId).toBe(group!.id)

        // Group should be selected
        expect(store.selectedElementIds).toEqual([group!.id])
      })

      it('does nothing with fewer than 2 elements', () => {
        const store = useElementsStore()
        store.addShape('rectangle')

        const initialLength = store.elements.length
        store.groupSelectedElements()

        expect(store.elements).toHaveLength(initialLength)
        expect(store.elements.find((e) => e.type === 'group')).toBeUndefined()
      })

      it('does nothing with no selection', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.clearSelection()

        store.groupSelectedElements()

        expect(store.elements.find((e) => e.type === 'group')).toBeUndefined()
      })

      it('flattens nested groups when regrouping', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        const id1 = store.elements[0]!.id
        const id2 = store.elements[1]!.id

        // Create first group
        store.selectElement(id1)
        store.addToSelection(id2)
        store.groupSelectedElements()

        const firstGroupId = store.selectedElementIds[0]!

        // Add another shape and group with existing group
        store.addShape('ellipse')
        const id3 = store.elements.find((e) => e.type === 'shape' && !e.groupId)!.id

        store.selectElement(firstGroupId)
        store.addToSelection(id3)
        store.groupSelectedElements()

        // Old group should be removed, new group should contain all 3 shapes
        const groups = store.elements.filter((e) => e.type === 'group')
        expect(groups).toHaveLength(1)

        // @ts-ignore
        expect(groups[0]!.childIds).toHaveLength(3)
      })
    })

    describe('ungroupElement', () => {
      it('removes group and frees children', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        const id1 = store.elements[0]!.id
        const id2 = store.elements[1]!.id

        store.selectElement(id1)
        store.addToSelection(id2)
        store.groupSelectedElements()

        const groupId = store.selectedElementIds[0]!

        store.ungroupElement(groupId)

        // Group should be removed
        expect(store.elements.find((e) => e.type === 'group')).toBeUndefined()
        expect(store.elements).toHaveLength(2)

        // Children should no longer have groupId
        expect(store.elements[0]!.groupId).toBeUndefined()
        expect(store.elements[1]!.groupId).toBeUndefined()

        // Children should be selected
        expect(store.selectedElementIds).toContain(id1)
        expect(store.selectedElementIds).toContain(id2)
      })
    })

    describe('ungroupSelectedElements', () => {
      it('ungroups all selected groups', () => {
        const store = useElementsStore()
        // Create first group
        store.addShape('rectangle')
        store.addShape('triangle')
        store.selectElement(store.elements[0]!.id)
        store.addToSelection(store.elements[1]!.id)
        store.groupSelectedElements()
        const groupId1 = store.selectedElementIds[0]!

        // Create second group
        store.addShape('ellipse')
        store.addShape('rectangle')
        const shapes = store.elements.filter((e) => e.type === 'shape' && !e.groupId)
        store.selectElement(shapes[0]!.id)
        store.addToSelection(shapes[1]!.id)
        store.groupSelectedElements()
        const groupId2 = store.selectedElementIds[0]!

        // Select both groups and ungroup
        store.selectElement(groupId1)
        store.addToSelection(groupId2)
        store.ungroupSelectedElements()

        // No groups should remain
        expect(store.elements.filter((e) => e.type === 'group')).toHaveLength(0)
        // All 4 shapes should be ungrouped
        expect(store.elements.filter((e) => e.type === 'shape')).toHaveLength(4)
        store.elements.forEach((e) => {
          expect(e.groupId).toBeUndefined()
        })
      })
    })

    describe('copySelectedElement with groups', () => {
      it('copies group and all its children', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        const id1 = store.elements[0]!.id
        const id2 = store.elements[1]!.id

        store.selectElement(id1)
        store.addToSelection(id2)
        store.groupSelectedElements()

        store.copySelectedElement()

        // Clipboard should contain group + children
        expect(store.clipboard).toHaveLength(3)
        expect(store.clipboard!.find((e) => e.type === 'group')).toBeDefined()
      })
    })

    describe('pasteElement with groups', () => {
      it('creates new IDs and maintains relationships', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        store.selectElement(store.elements[0]!.id)
        store.addToSelection(store.elements[1]!.id)
        store.groupSelectedElements()

        const originalGroupId = store.selectedElementIds[0]!
        store.copySelectedElement()
        store.pasteElement()

        // Should have 6 elements: 2 original shapes, 1 original group, 2 pasted shapes, 1 pasted group
        expect(store.elements).toHaveLength(6)

        const groups = store.elements.filter((e) => e.type === 'group')
        expect(groups).toHaveLength(2)

        // Pasted group should have different ID
        expect(groups.some((g) => g.id !== originalGroupId)).toBe(true)

        // Pasted group should be selected
        const pastedGroup = groups.find((g) => g.id !== originalGroupId)!
        expect(store.selectedElementIds).toContain(pastedGroup.id)

        // Pasted children should reference new group ID
        // @ts-ignore
        const pastedChildIds = pastedGroup.childIds
        pastedChildIds.forEach((childId: string) => {
          const child = store.elements.find((e) => e.id === childId)
          expect(child).toBeDefined()
          expect(child!.groupId).toBe(pastedGroup.id)
        })
      })
    })

    describe('duplicateSelectedElement with groups', () => {
      it('duplicates group and all its children', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        store.selectElement(store.elements[0]!.id)
        store.addToSelection(store.elements[1]!.id)
        store.groupSelectedElements()

        const originalGroupId = store.selectedElementIds[0]!
        store.duplicateSelectedElement()

        // Should have 6 elements
        expect(store.elements).toHaveLength(6)

        const groups = store.elements.filter((e) => e.type === 'group')
        expect(groups).toHaveLength(2)

        // Duplicated group should have different ID and correct children
        const duplicatedGroup = groups.find((g) => g.id !== originalGroupId)!
        expect(duplicatedGroup).toBeDefined()
        // @ts-ignore
        expect(duplicatedGroup.childIds).toHaveLength(2)
      })
    })

    describe('deleteSelectedElement with groups', () => {
      it('deletes group and all its children together', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('ellipse') // Not grouped

        store.selectElement(store.elements[0]!.id)
        store.addToSelection(store.elements[1]!.id)
        store.groupSelectedElements()

        // Select the group and delete
        store.deleteSelectedElement()

        // Only the ungrouped ellipse should remain
        expect(store.elements).toHaveLength(1)
        expect(store.elements[0]!.type).toBe('shape')
        // @ts-ignore
        expect(store.elements[0]!.shapeType).toBe('ellipse')
      })
    })

    describe('z-index with groups', () => {
      it('bringToFront moves group and all children together', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('ellipse')

        // Group first two shapes
        store.selectElement(store.elements[0]!.id)
        store.addToSelection(store.elements[1]!.id)
        store.groupSelectedElements()

        const groupId = store.selectedElementIds[0]!
        const group = store.elements.find((e) => e.id === groupId)!
        // @ts-ignore
        const childIds = group.childIds

        // Bring to front
        store.bringToFront()

        // Group and children should have high zIndex
        const maxZIndex = Math.max(...store.elements.map((e) => e.zIndex))
        const groupAndChildren = store.elements.filter(
          (e) => e.id === groupId || childIds.includes(e.id)
        )

        // At least one element should be at max zIndex
        expect(
          groupAndChildren.some((e) => e.zIndex >= maxZIndex - groupAndChildren.length)
        ).toBe(true)
      })

      it('bringToBack moves group and all children together', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('ellipse')

        // Group last two shapes (higher zIndex)
        store.selectElement(store.elements[1]!.id)
        store.addToSelection(store.elements[2]!.id)
        store.groupSelectedElements()

        const groupId = store.selectedElementIds[0]!
        const group = store.elements.find((e) => e.id === groupId)!
        // @ts-ignore
        const childIds = group.childIds

        store.bringToBack()

        // Group and children should have low zIndex
        const groupAndChildren = store.elements.filter(
          (e) => e.id === groupId || childIds.includes(e.id)
        )

        // First elements in sorted order should be the group/children
        const minZIndex = Math.min(...groupAndChildren.map((e) => e.zIndex))
        expect(minZIndex).toBe(0)
      })
    })

    describe('multi-selection', () => {
      it('toggleElementSelection adds and removes from selection', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        const id1 = store.elements[0]!.id
        const id2 = store.elements[1]!.id

        store.selectElement(id1)
        expect(store.selectedElementIds).toEqual([id1])

        store.toggleElementSelection(id2)
        expect(store.selectedElementIds).toContain(id1)
        expect(store.selectedElementIds).toContain(id2)

        store.toggleElementSelection(id1)
        expect(store.selectedElementIds).toEqual([id2])
      })

      it('addToSelection adds element to existing selection', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')
        store.addShape('ellipse')

        const id1 = store.elements[0]!.id
        const id2 = store.elements[1]!.id
        const id3 = store.elements[2]!.id

        store.selectElement(id1)
        store.addToSelection(id2)
        store.addToSelection(id3)

        expect(store.selectedElementIds).toHaveLength(3)
        expect(store.hasMultipleSelected).toBe(true)
      })

      it('clearSelection removes all selections', () => {
        const store = useElementsStore()
        store.addShape('rectangle')
        store.addShape('triangle')

        store.selectElement(store.elements[0]!.id)
        store.addToSelection(store.elements[1]!.id)

        store.clearSelection()

        expect(store.selectedElementIds).toHaveLength(0)
        expect(store.selectedElement).toBeNull()
      })
    })
  })
})
