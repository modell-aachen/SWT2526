export interface Rect {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_SIZE = 30

/**
 * Transforms global mouse delta to local element space.
 * Only supports 90° rotation increments (0, 90, 180, 270).
 */
function toLocalDelta(
  deltaX: number,
  deltaY: number,
  rotation: number
): { x: number; y: number } {
  const normalizedRotation = ((rotation % 360) + 360) % 360

  switch (normalizedRotation) {
    case 90:
      return { x: deltaY, y: -deltaX }
    case 180:
      return { x: -deltaX, y: -deltaY }
    case 270:
      return { x: -deltaY, y: deltaX }
    default: // 0
      return { x: deltaX, y: deltaY }
  }
}

/**
 * Transforms local center shift back to global space.
 * Only supports 90° rotation increments.
 */
function toGlobalShift(
  shiftX: number,
  shiftY: number,
  rotation: number
): { x: number; y: number } {
  const normalizedRotation = ((rotation % 360) + 360) % 360

  switch (normalizedRotation) {
    case 90:
      return { x: -shiftY, y: shiftX }
    case 180:
      return { x: -shiftX, y: -shiftY }
    case 270:
      return { x: shiftY, y: -shiftX }
    default: // 0
      return { x: shiftX, y: shiftY }
  }
}

/**
 * Calculates the new state of an element after resizing.
 * Only supports 90° rotation increments (0, 90, 180, 270).
 */
export function calculateNewElementState(
  element: Rect,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number
): Rect {
  const { x, y, width, height, rotation } = element
  const center = { x: x + width / 2, y: y + height / 2 }

  // Convert mouse delta to local (element) space
  const localDelta = toLocalDelta(deltaX, deltaY, rotation)

  let newWidth = width
  let newHeight = height
  let localCenterShiftX = 0
  let localCenterShiftY = 0

  // enforce scaled resizing on corner handles
  if (handle.includes('nw') || handle.includes('se')) {
    if (Math.abs(localDelta.x) < Math.abs(localDelta.y)) {
      localDelta.x = localDelta.y
    } else {
      localDelta.y = localDelta.x
    }
  } else if (handle.includes('ne') || handle.includes('sw')) {
    if (Math.abs(localDelta.x) < Math.abs(localDelta.y)) {
      localDelta.x = -localDelta.y
    } else {
      localDelta.y = -localDelta.x
    }
  }

  // Apply horizontal resize
  if (handle.includes('e')) {
    newWidth = Math.max(MIN_SIZE, width + localDelta.x)
    localCenterShiftX = (newWidth - width) / 2
  } else if (handle.includes('w')) {
    const proposedWidth = width - localDelta.x
    newWidth = Math.max(MIN_SIZE, proposedWidth)
    localCenterShiftX = -(newWidth - width) / 2
  }

  // Apply vertical resize
  if (handle.includes('s')) {
    newHeight = Math.max(MIN_SIZE, height + localDelta.y)
    localCenterShiftY = (newHeight - height) / 2
  } else if (handle.includes('n')) {
    const proposedHeight = height - localDelta.y
    newHeight = Math.max(MIN_SIZE, proposedHeight)
    localCenterShiftY = -(newHeight - height) / 2
  }

  // Convert center shift back to global space
  const globalShift = toGlobalShift(
    localCenterShiftX,
    localCenterShiftY,
    rotation
  )

  return {
    x: center.x + globalShift.x - newWidth / 2,
    y: center.y + globalShift.y - newHeight / 2,
    width: newWidth,
    height: newHeight,
    rotation,
  }
}

/**
 * Returns the visual bounding box of an element, accounting for rotation.
 * For 90 and 270 degree rotations, width and height are swapped,
 * and x/y are adjusted to maintain the same center point.
 */
export function getVisualBoundingBox(element: Rect): Rect {
  const { x, y, width, height, rotation } = element
  const normalizedRotation = ((rotation % 360) + 360) % 360

  if (normalizedRotation === 90 || normalizedRotation === 270) {
    const center = { x: x + width / 2, y: y + height / 2 }
    // Swap width and height
    return {
      x: center.x - height / 2,
      y: center.y - width / 2,
      width: height,
      height: width,
      rotation: normalizedRotation,
    }
  }

  return element
}
