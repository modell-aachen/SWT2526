import { computed } from 'vue'

interface Point {
  x: number
  y: number
}

export function useShapeRotation() {
  /**
   * Parse SVG points string into array of Point objects
   */
  const parsePoints = (pointsString: string): Point[] => {
    return pointsString
      .trim()
      .split(/\s+/)
      .map((point) => {
        const [x, y] = point.split(',').map(Number)
        return { x, y }
      })
  }

  /**
   * Rotates a point around the center (50, 50) by given degrees (clockwise)
   */
  const rotatePoint = (point: Point, degrees: number): Point => {
    const centerX = 50
    const centerY = 50
    const radians = (degrees * Math.PI) / 180

    // Translate point to origin
    const translatedX = point.x - centerX
    const translatedY = point.y - centerY

    // Rotate
    const rotatedX =
      translatedX * Math.cos(radians) - translatedY * Math.sin(radians)
    const rotatedY =
      translatedX * Math.sin(radians) + translatedY * Math.cos(radians)

    // Translate back
    return {
      x: rotatedX + centerX,
      y: rotatedY + centerY,
    }
  }

  /**
   * Convert array of points back to SVG points string
   */
  const pointsToString = (points: Point[]): string => {
    return points.map((p) => `${p.x},${p.y}`).join(' ')
  }

  /**
   * Calculate rotated points for a given points string
   */
  const getRotatedPoints = (points: string, rotation: number): string => {
    const parsedPoints = parsePoints(points)
    const rotatedPoints = parsedPoints.map((point) =>
      rotatePoint(point, rotation)
    )
    return pointsToString(rotatedPoints)
  }

  /**
   * Create a computed property for rotated points
   */
  const useRotatedPoints = (points: () => string, rotation: () => number) => {
    return computed(() => getRotatedPoints(points(), rotation()))
  }

  return {
    parsePoints,
    rotatePoint,
    pointsToString,
    getRotatedPoints,
    useRotatedPoints,
  }
}
