import { computed, type Ref, type ComputedRef } from 'vue'
import type { CanvasElement } from '@/types/Element'

export interface ShapeProps {
  width: number
  height: number
  fill: string
  outline: string
  strokeWeight: number
  rotation: number
  shapeType: string
  customPoints?: string
}

export interface TextProps {
  content: string
  color: string
  fontSize: number
  fontFamily: string
}

export interface IconProps {
  iconType: string
  color: string
  strokeWeight: number
}

export function useElementComponent(
  element: Ref<CanvasElement> | ComputedRef<CanvasElement>
) {
  const shapeProps = computed<ShapeProps | null>(() => {
    const el = element.value
    if (el.type !== 'shape') return null
    return {
      width: el.width,
      height: el.height,
      fill: el.fill,
      outline: el.outline,
      strokeWeight: el.strokeWeight,
      rotation: 0,
      shapeType: el.shapeType,
      customPoints: el.customPoints,
    }
  })

  const textProps = computed<TextProps | null>(() => {
    const el = element.value
    if (el.type !== 'text') return null
    return {
      content: el.content,
      color: el.color,
      fontSize: el.fontSize,
      fontFamily: el.fontFamily,
    }
  })

  const iconProps = computed<IconProps | null>(() => {
    const el = element.value
    if (el.type !== 'icon') return null
    return {
      iconType: el.iconType,
      color: el.color,
      strokeWeight: el.strokeWeight,
    }
  })

  return {
    shapeProps,
    textProps,
    iconProps,
  }
}
