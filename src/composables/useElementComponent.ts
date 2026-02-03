import { computed, type Component, type Ref, type ComputedRef } from 'vue'
import type { CanvasElement } from '@/types/Element'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import TextElementComponent from '@/components/TextElement/TextElement.vue'
import IconElementComponent from '@/components/IconElement/IconElement.vue'

export function useElementComponent(
    element: Ref<CanvasElement> | ComputedRef<CanvasElement>
) {
    const componentType = computed<Component | string>(() => {
        switch (element.value.type) {
            case 'shape':
                return GenericShape
            case 'text':
                return TextElementComponent
            case 'icon':
                return IconElementComponent
            default:
                return 'div'
        }
    })

    const componentProps = computed(() => {
        const el = element.value
        switch (el.type) {
            case 'shape':
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
            case 'text':
                return {
                    content: el.content,
                    color: el.color,
                    fontSize: el.fontSize,
                    fontFamily: el.fontFamily,
                }
            case 'icon':
                return {
                    iconType: el.iconType,
                    color: el.color,
                    strokeWeight: el.strokeWeight,
                }
            default:
                return {}
        }
    })

    return {
        componentType,
        componentProps,
    }
}
