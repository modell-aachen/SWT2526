export type ShapeType = 'rectangle' | 'triangle' | 'trapezoid'

export interface Shape {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  outline: string
  fill: string
  zIndex: number
}

export interface MouseDelta {
  deltaX: number
  deltaY: number
}

export interface ResizeHandle {
  position: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  x: number
  y: number
}
