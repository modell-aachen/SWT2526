export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_SIZE = 30

/**
 * Calculates the new state of an element after resizing.
 * Simplified version - no rotation conversion needed.
 */
export function calculateNewElementState(
  element: Rect,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number
): Rect {
  const { x, y, width, height } = element

  let newWidth = width
  let newHeight = height
  let newX = x
  let newY = y

  // Apply horizontal resize
  if (handle.includes('e')) {
    newWidth = Math.max(MIN_SIZE, width + deltaX)
  } else if (handle.includes('w')) {
    const proposedWidth = width - deltaX
    newWidth = Math.max(MIN_SIZE, proposedWidth)
    newX = x + (width - newWidth)
  }

  // Apply vertical resize
  if (handle.includes('s')) {
    newHeight = Math.max(MIN_SIZE, height + deltaY)
  } else if (handle.includes('n')) {
    const proposedHeight = height - deltaY
    newHeight = Math.max(MIN_SIZE, proposedHeight)
    newY = y + (height - newHeight)
  }

  return {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
  }
}
