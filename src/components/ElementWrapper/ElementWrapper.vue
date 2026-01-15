<template>
  <!-- Outer container: positioned but NOT rotated -->
  <div class="absolute" :style="containerStyle">
    <!-- Context Bar (Outside rotation, always upright) -->
    <div
      v-if="selected"
      class="absolute left-1/2 -translate-x-1/2"
      style="top: -48px"
    >
      <ElementContextBar
        :element="element"
        @copy="$emit('copy')"
        @duplicate="$emit('duplicate')"
        @rotate="$emit('rotate')"
        @delete="$emit('delete')"
      />
    </div>

    <!-- Rotating wrapper -->
    <div
      class="w-full h-full"
      :style="rotationStyle"
      @mousedown.stop="handleMouseDown"
    >
      <!-- Content -->
      <div class="w-full h-full overflow-hidden">
        <component
          :is="componentType"
          v-bind="componentProps"
          class="w-full h-full block"
        />
      </div>

      <!-- Selection UI (Rotates with element) -->
      <div v-if="selected" class="absolute inset-0 pointer-events-none">
        <div
          class="absolute -inset-0.5 border-2 border-ma-primary-500 pointer-events-none"
        ></div>

        <!-- Resize Handles -->
        <div
          v-for="handle in handles"
          :key="handle"
          class="absolute w-2 h-2 bg-ma-primary-500 border border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
          :style="getHandleStyle(handle)"
          @mousedown.stop="handleResizeStart(handle, $event)"
        ></div>
      </div>

      <!-- Link indicator -->
      <ElementLink v-if="element.link && !selected" :link="element.link" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasElement, ShapeElement, TextElement } from '@/types/Element'
import type { ResizeHandle } from '@/utils/elementTransforms'
import GenericShape from '../Shapes/GenericShape.vue'
import TextElementComponent from '../TextElement/TextElement.vue'
import ElementContextBar from '../ElementContextBar/ElementContextBar.vue'
import ElementLink from './ElementLink.vue'
import { useDraggable } from '@/composables/useDraggable'
import { useResizable } from '@/composables/useResizable'

const props = defineProps<{
  element: CanvasElement
  selected: boolean
}>()

const emit = defineEmits<{
  select: []
  click: [e: MouseEvent] // Required by useDraggable
  dragStart: [e: MouseEvent] // Required by useDraggable
  drag: [deltaX: number, deltaY: number]
  dragEnd: []
  resize: [handle: ResizeHandle, deltaX: number, deltaY: number]
  'resize-end': []
  rotate: []
  copy: []
  duplicate: []
  delete: []
}>()

const { startDrag } = useDraggable(emit)
const { startResize } = useResizable(emit as any)

const componentType = computed(() => {
  if (props.element.type === 'shape') {
    return GenericShape
  } else if (props.element.type === 'text') {
    return TextElementComponent
  }
  return 'div'
})

const componentProps = computed(() => {
  if (props.element.type === 'shape') {
    const shape = props.element as ShapeElement
    return {
      width: shape.width,
      height: shape.height,
      fill: shape.fill,
      outline: shape.outline,
      strokeWeight: shape.strokeWeight,
      rotation: 0,
      shapeType: shape.shapeType,
    }
  } else if (props.element.type === 'text') {
    const text = props.element as TextElement
    return {
      content: text.content,
      color: text.color,
      fontSize: text.fontSize,
      fontFamily: text.fontFamily,
    }
  }
  return {}
})

// Outer container: positioned but NOT rotated
const containerStyle = computed(() => ({
  left: `${props.element.x}px`,
  top: `${props.element.y}px`,
  width: `${props.element.width}px`,
  height: `${props.element.height}px`,
}))

// Inner rotating div
const rotationStyle = computed(() => ({
  transform: `rotate(${props.element.rotation}deg)`,
  transformOrigin: 'center center',
}))

const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

const getHandleStyle = (handle: ResizeHandle) => {
  switch (handle) {
    case 'nw':
      return { left: '0px', top: '0px' }
    case 'n':
      return { left: '50%', top: '0px' }
    case 'ne':
      return { left: '100%', top: '0px' }
    case 'e':
      return { left: '100%', top: '50%' }
    case 'se':
      return { left: '100%', top: '100%' }
    case 's':
      return { left: '50%', top: '100%' }
    case 'sw':
      return { left: '0px', top: '100%' }
    case 'w':
      return { left: '0px', top: '50%' }
  }
}

const handleMouseDown = (e: MouseEvent) => {
  emit('select')
  startDrag(e)
}

const handleResizeStart = (handle: ResizeHandle, e: MouseEvent) => {
  startResize(handle, e)
}
</script>
