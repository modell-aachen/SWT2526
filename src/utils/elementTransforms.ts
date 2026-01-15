export interface Rect {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

interface Point {
  x: number
  y: number
}

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/**
 * Rotates a point around a center.
 */
export function rotatePoint(
  point: Point,
  center: Point,
  angleDegrees: number
): Point {
  const angleRadians = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(angleRadians)
  const sin = Math.sin(angleRadians)

  const dx = point.x - center.x
  const dy = point.y - center.y

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  }
}

/**
 * Calculates the new state of a rotated element after resizing.
 *
 * Logic:
 * 1. Convert mouse delta to local coordinate system of the element.
 * 2. Apply delta to width/height/local-position based on handle.
 * 3. Convert back to global coordinates.
 */
export function calculateNewElementState(
  element: Rect,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number
): Rect {
  const { x, y, width, height, rotation } = element
  const center = { x: x + width / 2, y: y + height / 2 }

  // Rotate delta to local space (inverse rotation of the object)
  // We are rotating the vector (deltaX, deltaY) by -rotation
  const rad = (-rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const localDeltaX = deltaX * cos - deltaY * sin
  const localDeltaY = deltaX * sin + deltaY * cos

  let newWidth = width
  let newHeight = height
  let newLocalCenterX = 0 // Relative shift from old center in local space
  let newLocalCenterY = 0 // Relative shift from old center in local space

  // Safety minimum size
  const MIN_SIZE = 10

  // Apply resizing in local unrotated space
  // Note: delta is cumulative from drag start usually, but here we assume incremental?
  // The wrapper emits dragging deltas.

  // Horizontal
  if (handle.includes('e')) {
    newWidth = Math.max(MIN_SIZE, width + localDeltaX)
    newLocalCenterX = (newWidth - width) / 2
  } else if (handle.includes('w')) {
    const proposedWidth = width - localDeltaX
    if (proposedWidth >= MIN_SIZE) {
      newWidth = proposedWidth
      newLocalCenterX = -(newWidth - width) / 2
    } else {
      // If we hit min size, stop moving center
      // (Simplified logic, exact clamping requires more math)
      newWidth = MIN_SIZE
      newLocalCenterX = (MIN_SIZE - width) / 2
    }
  }

  // Vertical
  if (handle.includes('s')) {
    newHeight = Math.max(MIN_SIZE, height + localDeltaY)
    newLocalCenterY = (newHeight - height) / 2
  } else if (handle.includes('n')) {
    const proposedHeight = height - localDeltaY
    if (proposedHeight >= MIN_SIZE) {
      newHeight = proposedHeight
      newLocalCenterY = -(newHeight - height) / 2
    } else {
      newHeight = MIN_SIZE
      newLocalCenterY = (MIN_SIZE - height) / 2
    }
  }

  // Calculate new global center
  // Rotate the local center shift back to global space by +rotation
  const globalShiftRad = (rotation * Math.PI) / 180
  const gsCos = Math.cos(globalShiftRad)
  const gsSin = Math.sin(globalShiftRad)

  const globalShiftX = newLocalCenterX * gsCos - newLocalCenterY * gsSin
  const globalShiftY = newLocalCenterX * gsSin + newLocalCenterY * gsCos

  const newCenterX = center.x + globalShiftX
  const newCenterY = center.y + globalShiftY

  return {
    x: newCenterX - newWidth / 2,
    y: newCenterY - newHeight / 2,
    width: newWidth,
    height: newHeight,
    rotation, // Rotation never changes during resize
  }
}
