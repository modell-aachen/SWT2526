/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import type { CanvasElement, ShapeElement } from '@/types/Element'
import type { GroupElement } from '@/types/GroupElement'
import {
  collectWithChildren,
  collectAllWithChildren,
  remapGroupIds,
  calculateGroupBounds,
  resizeGroupChildren,
  rotateGroupChildren,
} from './groupUtils'

function makeShape(
  id: string,
  x = 0,
  y = 0,
  w = 100,
  h = 100,
  opts: Partial<ShapeElement> = {}
): ShapeElement {
  return {
    id,
    type: 'shape',
    shapeType: 'rectangle',
    x,
    y,
    width: w,
    height: h,
    rotation: 0,
    zIndex: 0,
    fill: 'transparent',
    outline: '#000',
    strokeWeight: 3,
    ...opts,
  }
}

function makeGroup(
  id: string,
  childIds: string[],
  x = 0,
  y = 0,
  w = 200,
  h = 200
): GroupElement {
  return {
    id,
    type: 'group',
    childIds,
    x,
    y,
    width: w,
    height: h,
    rotation: 0,
    zIndex: 10,
  }
}

describe('groupUtils', () => {
  describe('collectWithChildren', () => {
    it('returns just the element for a non-group', () => {
      const shape = makeShape('s1')
      const elements: CanvasElement[] = [shape]

      const result = collectWithChildren('s1', elements)
      expect(result).toEqual([shape])
    })

    it('returns the group and all its children', () => {
      const s1 = makeShape('s1', 0, 0, 100, 100, { groupId: 'g1' })
      const s2 = makeShape('s2', 50, 50, 100, 100, { groupId: 'g1' })
      const group = makeGroup('g1', ['s1', 's2'])
      const elements: CanvasElement[] = [s1, s2, group]

      const result = collectWithChildren('g1', elements)
      expect(result).toHaveLength(3)
      expect(result).toContainEqual(group)
      expect(result).toContainEqual(s1)
      expect(result).toContainEqual(s2)
    })

    it('returns empty array if element not found', () => {
      const result = collectWithChildren('nonexistent', [])
      expect(result).toEqual([])
    })
  })

  describe('collectAllWithChildren', () => {
    it('expands groups in a list of selected IDs', () => {
      const s1 = makeShape('s1', 0, 0, 100, 100, { groupId: 'g1' })
      const s2 = makeShape('s2', 50, 50, 100, 100, { groupId: 'g1' })
      const s3 = makeShape('s3', 200, 200)
      const group = makeGroup('g1', ['s1', 's2'])
      const elements: CanvasElement[] = [s1, s2, s3, group]

      const result = collectAllWithChildren(['g1', 's3'], elements)
      expect(result).toHaveLength(4) // group + 2 children + s3
    })

    it('does not duplicate already-included children', () => {
      const s1 = makeShape('s1', 0, 0, 100, 100, { groupId: 'g1' })
      const group = makeGroup('g1', ['s1'])
      const elements: CanvasElement[] = [s1, group]

      // Selecting both the group and one of its children
      const result = collectAllWithChildren(['g1', 's1'], elements)
      expect(result).toHaveLength(2) // group + child, no duplicates
    })
  })

  describe('remapGroupIds', () => {
    it('remaps groupId on children and childIds on groups', () => {
      const s1 = makeShape('s1-new', 0, 0, 100, 100, { groupId: 'g1-old' })
      const group: GroupElement = makeGroup('g1-new', ['s1-old'])
      const elements: CanvasElement[] = [s1, group]

      const idMapping: Record<string, string> = {
        's1-old': 's1-new',
        'g1-old': 'g1-new',
      }

      remapGroupIds(elements, idMapping)

      expect(s1.groupId).toBe('g1-new')
      expect(group.childIds).toEqual(['s1-new'])
    })

    it('leaves unmapped IDs unchanged', () => {
      const s1 = makeShape('s1', 0, 0, 100, 100, { groupId: 'g-unknown' })
      const elements: CanvasElement[] = [s1]

      remapGroupIds(elements, {})

      expect(s1.groupId).toBe('g-unknown')
    })
  })

  describe('calculateGroupBounds', () => {
    it('calculates bounding box for non-rotated elements', () => {
      const s1 = makeShape('s1', 10, 20, 100, 50)
      const s2 = makeShape('s2', 50, 30, 80, 90)

      const bounds = calculateGroupBounds([s1, s2])

      expect(bounds.x).toBe(10)
      expect(bounds.y).toBe(20)
      expect(bounds.width).toBe(120) // max(10+100, 50+80) - 10 = 130 - 10
      expect(bounds.height).toBe(100) // max(20+50, 30+90) - 20 = 120 - 20
    })

    it('accounts for 90° rotation in bounding box', () => {
      // A 100x50 element at (0, 0) rotated 90° has visual bounds:
      // center = (50, 25), visual width=50, visual height=100
      // visual x = 50 - 25 = 25, visual y = 25 - 50 = -25
      const s1 = makeShape('s1', 0, 0, 100, 50, { rotation: 90 })

      const bounds = calculateGroupBounds([s1])

      expect(bounds.x).toBe(25) // center.x - height/2 = 50 - 25
      expect(bounds.y).toBe(-25) // center.y - width/2 = 25 - 50
      expect(bounds.width).toBe(50) // original height
      expect(bounds.height).toBe(100) // original width
    })

    it('handles mixed rotated and non-rotated elements', () => {
      // s1: non-rotated 100x100 at (0, 0) → visual bounds: (0, 0, 100, 100)
      const s1 = makeShape('s1', 0, 0, 100, 100)
      // s2: 200x50 at (150, 50) rotated 90°
      //   center = (150+100, 50+25) = (250, 75)
      //   visual: x=250-25=225, y=75-100=-25, w=50, h=200
      //   visual maxX=225+50=275, maxY=-25+200=175
      const s2 = makeShape('s2', 150, 50, 200, 50, { rotation: 90 })

      const bounds = calculateGroupBounds([s1, s2])

      // Union: minX=0, minY=-25, maxX=275, maxY=175
      expect(bounds.x).toBe(0)
      expect(bounds.y).toBe(-25)
      expect(bounds.width).toBe(275)
      expect(bounds.height).toBe(200) // 175 - (-25) = 200
    })
  })

  describe('resizeGroupChildren', () => {
    it('scales non-rotated children proportionally', () => {
      const s1 = makeShape('s1', 0, 0, 100, 100, { groupId: 'g1' })
      const s2 = makeShape('s2', 100, 0, 100, 100, { groupId: 'g1' })
      const group = makeGroup('g1', ['s1', 's2'], 0, 0, 200, 100)
      const elements: CanvasElement[] = [s1, s2, group]

      const oldBounds = { x: 0, y: 0, width: 200, height: 100 }
      const newBounds = { x: 0, y: 0, width: 400, height: 200 }

      const updates = resizeGroupChildren(group, oldBounds, newBounds, elements)

      expect(updates).toHaveLength(2)
      // s1: relX=0, relY=0, scaled: (0, 0, 200, 200)
      const u1 = updates.find((u) => u.id === 's1')!
      expect(u1.updates.x).toBe(0)
      expect(u1.updates.y).toBe(0)
      expect(u1.updates.width).toBe(200)
      expect(u1.updates.height).toBe(200)

      // s2: relX=100, relY=0, scaled: (200, 0, 200, 200)
      const u2 = updates.find((u) => u.id === 's2')!
      expect(u2.updates.x).toBe(200)
      expect(u2.updates.y).toBe(0)
      expect(u2.updates.width).toBe(200)
      expect(u2.updates.height).toBe(200)
    })

    it('correctly handles rotated children', () => {
      // 200x50 at (0, 0) rotated 90°
      // Visual: center=(100,25), visual x=75, y=-75, w=50, h=200
      const s1 = makeShape('s1', 0, 0, 200, 50, { groupId: 'g1', rotation: 90 })
      const group = makeGroup('g1', ['s1'], 75, -75, 50, 200)
      const elements: CanvasElement[] = [s1, group]

      const oldBounds = { x: 75, y: -75, width: 50, height: 200 }
      // Double the visual size
      const newBounds = { x: 75, y: -75, width: 100, height: 400 }

      const updates = resizeGroupChildren(group, oldBounds, newBounds, elements)

      expect(updates).toHaveLength(1)
      const u = updates[0]!
      // Visual was 50x200, now 100x400
      // Since rotated 90°, element w/h are swapped from visual h/w
      expect(u.updates.width).toBe(400) // visual height
      expect(u.updates.height).toBe(100) // visual width
    })
  })

  describe('rotateGroupChildren', () => {
    it('rotates children 90° around group center and returns new bounds', () => {
      // Two 100x100 shapes side by side: group is (0, 0, 200, 100)
      const s1 = makeShape('s1', 0, 0, 100, 100, { groupId: 'g1' })
      const s2 = makeShape('s2', 100, 0, 100, 100, { groupId: 'g1' })
      const group = makeGroup('g1', ['s1', 's2'], 0, 0, 200, 100)
      const elements: CanvasElement[] = [s1, s2, group]

      const result = rotateGroupChildren(group, elements)

      expect(result.childUpdates).toHaveLength(2)
      // Children should each get rotation=90
      result.childUpdates.forEach((u) => {
        expect(u.updates.rotation).toBe(90)
      })
      // New group bounds should be recalculated
      expect(result.newGroupBounds).toBeDefined()
      expect(result.newGroupBounds.width).toBeDefined()
      expect(result.newGroupBounds.height).toBeDefined()
    })

    it('adds 90° to existing child rotation', () => {
      const s1 = makeShape('s1', 0, 0, 100, 100, {
        groupId: 'g1',
        rotation: 90,
      })
      const group = makeGroup('g1', ['s1'], 0, 0, 100, 100)
      const elements: CanvasElement[] = [s1, group]

      const result = rotateGroupChildren(group, elements)

      const u = result.childUpdates[0]!
      expect(u.updates.rotation).toBe(180)
    })
  })
})
