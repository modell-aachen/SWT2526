import type { ShapeType } from './ShapeType'
import type { GroupElement } from './GroupElement'

export type ElementType = 'shape' | 'text' | 'icon' | 'group'

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
  groupId?: string // ID of parent group, if this element is grouped
}

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shapeType: ShapeType
  fill: string
  outline: string
  strokeWeight: number
  customPoints?: string
  text?: string
  textColor?: string
  fontSize?: number
  fontFamily?: string
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

export type CanvasElement =
  | ShapeElement
  | TextElement
  | IconElement
  | GroupElement
