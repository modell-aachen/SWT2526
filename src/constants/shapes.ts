import type { ShapeType } from '@/types/ShapeType'

/**
 * Shape definition containing points and metadata
 */
export interface ShapeDefinition {
  /** SVG polygon points string (in 100x100 viewBox) */
  points: string
  /** Human-readable label */
  label: string
  /** Whether this shape uses polygon (false for ellipse) */
  isPolygon: boolean
}

/**
 * All shape definitions with their SVG points and metadata
 * Points are defined in a 100x100 viewBox coordinate system
 */
export const SHAPE_DEFINITIONS: Record<ShapeType, ShapeDefinition> = {
  rectangle: {
    points: '5,5 95,5 95,95 5,95',
    label: 'Rectangle',
    isPolygon: true,
  },
  triangle: {
    points: '50,5 95,95 5,95',
    label: 'Triangle',
    isPolygon: true,
  },
  trapezoid: {
    points: '25,5 75,5 95,95 5,95',
    label: 'Trapezoid',
    isPolygon: true,
  },
  diamond: {
    points: '50,5 95,50 50,95 5,50',
    label: 'Diamond',
    isPolygon: true,
  },
  parallelogram: {
    points: '20,5 95,5 80,95 5,95',
    label: 'Parallelogram',
    isPolygon: true,
  },
  hexagon: {
    points: '25,5 75,5 95,50 75,95 25,95 5,50',
    label: 'Hexagon',
    isPolygon: true,
  },
  chevron: {
    points: '5,5 70,5 95,50 70,95 5,95 30,50',
    label: 'Chevron',
    isPolygon: true,
  },
  roundedRectangle: {
    points: '15,5 85,5 95,15 95,85 85,95 15,95 5,85 5,15',
    label: 'Rounded Rectangle',
    isPolygon: true,
  },
  ellipse: {
    points: '', // Ellipse uses SVG <ellipse> element, not polygon
    label: 'Ellipse',
    isPolygon: false,
  },
}

/**
 * Get the base points for a shape type
 */
export function getShapePoints(shapeType: ShapeType): string {
  return (
    SHAPE_DEFINITIONS[shapeType]?.points ?? SHAPE_DEFINITIONS.rectangle.points
  )
}

/**
 * Get the label for a shape type
 */
export function getShapeLabel(shapeType: ShapeType): string {
  return SHAPE_DEFINITIONS[shapeType]?.label ?? shapeType
}

/**
 * Check if a shape type uses polygon rendering
 */
export function isPolygonShape(shapeType: ShapeType): boolean {
  return SHAPE_DEFINITIONS[shapeType]?.isPolygon ?? true
}

/**
 * Get all available shape types
 */
export function getAllShapeTypes(): ShapeType[] {
  return Object.keys(SHAPE_DEFINITIONS) as ShapeType[]
}

/**
 * Get all polygon-based shape types (excludes ellipse)
 */
export function getPolygonShapeTypes(): ShapeType[] {
  return getAllShapeTypes().filter((type) => isPolygonShape(type))
}
