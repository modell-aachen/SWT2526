import type { CanvasElement } from '@/types/Element'
import type { GroupElement } from '@/types/GroupElement'
import { getVisualBoundingBox } from './elementTransforms'

/**
 * Collects an element and, if it's a group, all its children.
 * Returns an empty array if the element is not found.
 */
export function collectWithChildren(
  id: string,
  elements: CanvasElement[]
): CanvasElement[] {
  const element = elements.find((e) => e.id === id)
  if (!element) return []

  const result: CanvasElement[] = [element]

  if (element.type === 'group') {
    const group = element as GroupElement
    group.childIds.forEach((childId) => {
      const child = elements.find((e) => e.id === childId)
      if (child && !result.some((r) => r.id === child.id)) {
        result.push(child)
      }
    })
  }

  return result
}

/**
 * Collects all elements for a list of selected IDs, expanding groups
 * to include their children. De-duplicates results.
 */
export function collectAllWithChildren(
  ids: string[],
  elements: CanvasElement[]
): CanvasElement[] {
  const result: CanvasElement[] = []
  const seenIds = new Set<string>()

  ids.forEach((id) => {
    const collected = collectWithChildren(id, elements)
    collected.forEach((el) => {
      if (!seenIds.has(el.id)) {
        seenIds.add(el.id)
        result.push(el)
      }
    })
  })

  return result
}

/**
 * Remaps groupId on children and childIds on groups using an ID mapping.
 * Mutates the elements in place.
 */
export function remapGroupIds(
  elements: CanvasElement[],
  idMapping: Record<string, string>
): void {
  elements.forEach((el) => {
    // Remap groupId if this element belongs to a group
    if (el.groupId && idMapping[el.groupId]) {
      el.groupId = idMapping[el.groupId]
    }

    // Remap childIds if this is a group
    if (el.type === 'group') {
      const group = el as GroupElement
      group.childIds = group.childIds.map(
        (childId) => idMapping[childId] || childId
      )
    }
  })
}

/**
 * Calculates the union bounding box for a set of elements,
 * accounting for rotation via getVisualBoundingBox.
 */
export function calculateGroupBounds(elements: CanvasElement[]): {
  x: number
  y: number
  width: number
  height: number
} {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  elements.forEach((el) => {
    const vb = getVisualBoundingBox(el)
    minX = Math.min(minX, vb.x)
    minY = Math.min(minY, vb.y)
    maxX = Math.max(maxX, vb.x + vb.width)
    maxY = Math.max(maxY, vb.y + vb.height)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export type ElementUpdate = { id: string; updates: Partial<CanvasElement> }

/**
 * Calculates proportional child updates when a group is resized.
 * Uses visual bounding boxes to correctly handle rotated children.
 * Returns a list of updates to apply — does NOT mutate anything.
 */
export function resizeGroupChildren(
  group: GroupElement,
  oldBounds: { x: number; y: number; width: number; height: number },
  newBounds: { x: number; y: number; width: number; height: number },
  elements: CanvasElement[]
): ElementUpdate[] {
  const scaleX = oldBounds.width > 0 ? newBounds.width / oldBounds.width : 1
  const scaleY = oldBounds.height > 0 ? newBounds.height / oldBounds.height : 1
  const updates: ElementUpdate[] = []

  group.childIds.forEach((childId) => {
    const child = elements.find((e) => e.id === childId)
    if (!child) return

    const childVisual = getVisualBoundingBox(child)
    const relativeX = childVisual.x - oldBounds.x
    const relativeY = childVisual.y - oldBounds.y

    const newVisualX = newBounds.x + relativeX * scaleX
    const newVisualY = newBounds.y + relativeY * scaleY
    const newVisualW = Math.max(10, childVisual.width * scaleX)
    const newVisualH = Math.max(10, childVisual.height * scaleY)

    const normalizedRotation = ((child.rotation % 360) + 360) % 360
    const isSwapped = normalizedRotation === 90 || normalizedRotation === 270

    if (isSwapped) {
      const newElW = newVisualH
      const newElH = newVisualW
      const centerX = newVisualX + newVisualW / 2
      const centerY = newVisualY + newVisualH / 2
      updates.push({
        id: childId,
        updates: {
          x: centerX - newElW / 2,
          y: centerY - newElH / 2,
          width: newElW,
          height: newElH,
        },
      })
    } else {
      updates.push({
        id: childId,
        updates: {
          x: newVisualX,
          y: newVisualY,
          width: newVisualW,
          height: newVisualH,
        },
      })
    }
  })

  return updates
}

/**
 * Calculates 90° clockwise rotation for all children of a group.
 * Rotates each child around the group's center, increments their rotation,
 * and returns the child updates plus the recalculated group bounds.
 * Does NOT mutate anything.
 */
export function rotateGroupChildren(
  group: GroupElement,
  elements: CanvasElement[]
): {
  childUpdates: ElementUpdate[]
  newGroupBounds: { x: number; y: number; width: number; height: number }
} {
  const groupCenterX = group.x + group.width / 2
  const groupCenterY = group.y + group.height / 2
  const childUpdates: ElementUpdate[] = []

  // Build updated child states for bounds recalculation
  const updatedChildStates: CanvasElement[] = []

  group.childIds.forEach((childId) => {
    const child = elements.find((e) => e.id === childId)
    if (!child) return

    const childCenterX = child.x + child.width / 2
    const childCenterY = child.y + child.height / 2

    const offsetX = childCenterX - groupCenterX
    const offsetY = childCenterY - groupCenterY

    // Rotate offset by 90° clockwise: (x, y) -> (y, -x)
    const newOffsetX = offsetY
    const newOffsetY = -offsetX

    const newChildCenterX = groupCenterX + newOffsetX
    const newChildCenterY = groupCenterY + newOffsetY
    const newRotation = (child.rotation + 90) % 360

    const update = {
      x: newChildCenterX - child.width / 2,
      y: newChildCenterY - child.height / 2,
      rotation: newRotation,
    }

    childUpdates.push({ id: childId, updates: update })

    // Keep a copy with updated state for bounds calculation
    updatedChildStates.push({
      ...child,
      ...update,
    } as CanvasElement)
  })

  const newGroupBounds = calculateGroupBounds(updatedChildStates)

  return { childUpdates, newGroupBounds }
}
