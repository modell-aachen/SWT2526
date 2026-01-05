import type { ShapeType } from '@/types/ShapeType'

export function useShapeBasePoints() {
  /**
   * Get the base points for a shape type
   */
  const getBasePoints = (shapeType: ShapeType): string => {
    switch (shapeType) {
      case 'rectangle':
        return '5,5 95,5 95,95 5,95'
      case 'triangle':
        return '50,5 95,95 5,95'
      case 'trapezoid':
        return '25,5 75,5 95,95 5,95'
      default:
        return '5,5 95,5 95,95 5,95'
    }
  }

  return {
    getBasePoints,
  }
}
