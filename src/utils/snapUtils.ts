import type { CanvasElement } from '@/types/Element'
import type {
  SnapPoint,
  SnapLine,
  SnapResult,
  SnapPointType,
} from '@/types/snapping'

import { getVisualBoundingBox } from './elementTransforms'
import { useZoomStore } from '@/stores/zoom/zoom'

/**
 * Extract all snap points from an element's bounds
 */
export function getElementSnapPoints(element: CanvasElement): SnapPoint[] {
  const visualBounds = getVisualBoundingBox(element)
  const { x, y, width, height } = visualBounds
  const { id } = element

  return [
    { value: x, type: 'left' as SnapPointType, elementId: id },
    { value: x + width, type: 'right' as SnapPointType, elementId: id },
    { value: y, type: 'top' as SnapPointType, elementId: id },
    { value: y + height, type: 'bottom' as SnapPointType, elementId: id },
    { value: x + width / 2, type: 'center-x' as SnapPointType, elementId: id },
    { value: y + height / 2, type: 'center-y' as SnapPointType, elementId: id },
  ]
}

/**
 * Get horizontal snap points (left, right, center-x)
 * These points are used for calculating X-axis snaps
 */
export function getHorizontalSnapPoints(snapPoints: SnapPoint[]): SnapPoint[] {
  return snapPoints.filter(
    (p) => p.type === 'left' || p.type === 'right' || p.type === 'center-x'
  )
}

/**
 * Get vertical snap points (top, bottom, center-y)
 * These points are used for calculating Y-axis snaps
 */
export function getVerticalSnapPoints(snapPoints: SnapPoint[]): SnapPoint[] {
  return snapPoints.filter(
    (p) => p.type === 'top' || p.type === 'bottom' || p.type === 'center-y'
  )
}

/**
 * Find the nearest snap point within threshold distance
 */
export function findSnapPosition(
  position: number,
  snapPoints: SnapPoint[],
  threshold: number
): { snappedValue: number; snapPoint: SnapPoint } | null {
  let closestPoint: SnapPoint | null = null
  let minDistance = Infinity

  for (const point of snapPoints) {
    const distance = Math.abs(position - point.value)
    if (distance <= threshold && distance < minDistance) {
      minDistance = distance
      closestPoint = point
    }
  }

  if (closestPoint === null) {
    return null
  }

  return {
    snappedValue: closestPoint.value,
    snapPoint: closestPoint,
  }
}

/**
 * Calculate snap lines for visualization
 * Lines span the entire viewport for better visibility
 */
function createSnapLine(snapPoint: SnapPoint): SnapLine {
  const isHorizontal =
    snapPoint.type === 'top' ||
    snapPoint.type === 'bottom' ||
    snapPoint.type === 'center-y'

  const zoomStore = useZoomStore()
  const container = document.querySelector('[data-testid="canvas-container"]')

  // Make lines span the entire visible area (large values to cover viewport)
  let viewportWidth = 10000
  let viewportHeight = 10000

  if (container) {
    viewportWidth = container?.clientWidth
    viewportHeight = container?.clientHeight
  }

  if (isHorizontal) {
    // Horizontal line - spans entire width
    return {
      axis: 'horizontal',
      position: snapPoint.value,
      start: 0,
      end: viewportWidth / zoomStore.zoom,
    }
  } else {
    // Vertical line - spans entire height
    return {
      axis: 'vertical',
      position: snapPoint.value,
      start: 0,
      end: viewportHeight / zoomStore.zoom,
    }
  }
}

/**
 * Calculate snapped position and snap lines for a dragged element
 */
export function calculateSnapResult(
  draggedElement: CanvasElement,
  otherElements: CanvasElement[],
  threshold: number
): SnapResult {
  // Filter out the dragged element itself
  const targetElements = otherElements.filter((e) => e.id !== draggedElement.id)

  // If no other elements, no snapping occurs
  if (targetElements.length === 0) {
    return {
      x: draggedElement.x,
      y: draggedElement.y,
      snapLines: [],
    }
  }

  // Get snap points from dragged element
  const draggedSnapPoints = getElementSnapPoints(draggedElement)
  const draggedHorizontalPoints = getHorizontalSnapPoints(draggedSnapPoints)
  const draggedVerticalPoints = getVerticalSnapPoints(draggedSnapPoints)

  // Collect all snap points from other elements
  const targetSnapPoints = targetElements.flatMap(getElementSnapPoints)
  const targetHorizontalPoints = getHorizontalSnapPoints(targetSnapPoints)
  const targetVerticalPoints = getVerticalSnapPoints(targetSnapPoints)

  // Try to snap horizontally (X axis)
  let snappedX = draggedElement.x
  let horizontalSnapPoint: SnapPoint | null = null
  let minXOffset = Infinity

  for (const draggedPoint of draggedHorizontalPoints) {
    const snapResult = findSnapPosition(
      draggedPoint.value,
      targetHorizontalPoints,
      threshold
    )
    if (snapResult) {
      const offset = snapResult.snappedValue - draggedPoint.value
      // If this snap is closer (smaller movement needed), use it
      if (Math.abs(offset) < Math.abs(minXOffset)) {
        minXOffset = offset
        snappedX = draggedElement.x + offset
        horizontalSnapPoint = snapResult.snapPoint
      }
    }
  }

  // Try to snap vertically (Y axis)
  let snappedY = draggedElement.y
  let verticalSnapPoint: SnapPoint | null = null
  let minYOffset = Infinity

  for (const draggedPoint of draggedVerticalPoints) {
    const snapResult = findSnapPosition(
      draggedPoint.value,
      targetVerticalPoints,
      threshold
    )
    if (snapResult) {
      const offset = snapResult.snappedValue - draggedPoint.value
      // If this snap is closer (smaller movement needed), use it
      if (Math.abs(offset) < Math.abs(minYOffset)) {
        minYOffset = offset
        snappedY = draggedElement.y + offset
        verticalSnapPoint = snapResult.snapPoint
      }
    }
  }

  // Create snap lines whenever snapping is detected (even if position doesn't change)
  const snapLines: SnapLine[] = []

  if (horizontalSnapPoint) {
    snapLines.push(createSnapLine(horizontalSnapPoint))
  }

  if (verticalSnapPoint) {
    snapLines.push(createSnapLine(verticalSnapPoint))
  }

  return {
    x: snappedX,
    y: snappedY,
    snapLines,
  }
}
