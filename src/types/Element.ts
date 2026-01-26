import type { ShapeType } from './ShapeType'

export type ElementType = 'shape' | 'text' | 'icon'

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
  shapeType: ShapeType
  fill: string
  outline: string
  strokeWeight: number
  customPoints?: string
}

export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontSize: number
  fontFamily: string
  color: string
}

export interface IconElement extends BaseElement {
  type: 'icon'
  iconType: string
  color: string
  strokeWeight: number
}

export type CanvasElement = ShapeElement | TextElement | IconElement
