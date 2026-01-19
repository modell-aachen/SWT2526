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
