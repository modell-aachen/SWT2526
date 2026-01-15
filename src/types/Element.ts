export type ElementType = 'shape' | 'text'

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  link?: string
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shapeType: 'rectangle' | 'triangle' | 'trapezoid'
  fill: string
  outline: string
  strokeWeight: number
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontSize: number
  fontFamily: string
  color: string
}

export type CanvasElement = ShapeElement | TextElement
