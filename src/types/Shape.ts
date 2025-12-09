import type { ShapeType } from './ShapeType'

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
  rotation: number
}
