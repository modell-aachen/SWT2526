<template>
  <component
    :is="element.link ? 'a' : 'div'"
    class="absolute block"
    :style="wrapperStyle"
    v-bind="
      element.link
        ? {
            href: element.link,
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {}
    "
  >
    <div class="w-full h-full">
      <GenericShape v-if="shapeProps" v-bind="shapeProps" />
      <TextElement v-else-if="textProps" v-bind="textProps" />
      <IconElement v-else-if="iconProps" v-bind="iconProps" />
    </div>

    <ElementTextOverlay
      v-if="element.type === 'shape'"
      :element="element as ShapeElement"
    />
    <ElementLink v-if="element.link" :link="element.link" />
  </component>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CanvasElement, ShapeElement } from '@/types/Element'
import { useElementComponent } from '@/composables/useElementComponent'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import TextElement from '@/components/TextElement/TextElement.vue'
import IconElement from '@/components/IconElement/IconElement.vue'
import ElementTextOverlay from '@/components/ElementWrapper/ElementTextOverlay.vue'
import ElementLink from '@/components/ElementWrapper/ElementLink.vue'

const props = defineProps<{
  element: CanvasElement
}>()

const { shapeProps, textProps, iconProps } = useElementComponent(
  toRef(props, 'element')
)

const wrapperStyle = computed(() => ({
  left: `${props.element.x}px`,
  top: `${props.element.y}px`,
  width: `${props.element.width}px`,
  height: `${props.element.height}px`,
  transform: `rotate(${props.element.rotation}deg)`,
  transformOrigin: 'center center',
  cursor: props.element.link ? 'pointer' : undefined,
}))
</script>
