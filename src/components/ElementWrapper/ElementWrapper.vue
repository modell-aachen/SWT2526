<template>
  <div class="absolute" :style="wrapperStyle" @mousedown.stop="handleMouseDown">
    <!-- Content -->
    <div class="w-full h-full">
      <component
        :is="componentType"
        v-bind="componentProps"
        class="w-full h-full block"
      />
    </div>

    <div v-if="selected" class="absolute inset-0 pointer-events-none">
      <div
        class="absolute -inset-3 border-2 border-ma-primary-500 pointer-events-none"
      ></div>

      <!-- Resize Handles -->
      <div
        v-for="handle in visibleHandles"
        :key="handle"
        class="absolute w-2 h-2 bg-ma-primary-500 border border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
        :style="getHandleStyle(handle)"
        @mousedown.stop="handleResizeStart(handle, $event)"
      ></div>
    </div>

    <!-- Link indicator -->
    <ElementLink v-if="element.link && !selected" :link="element.link" />
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { CanvasElement } from '@/types/Element'
import type { ResizeHandle } from '@/utils/elementTransforms'
import type { ResizeEvents } from '@/types/ResizeEvents'
import type { ElementWrapperEvents } from '@/types/ElementWrapperEvents'
import ElementLink from './ElementLink.vue'
import {
  getHandleStyle,
  resizeHandles as allHandles,
} from '@/utils/wrapperUtils'
import { useDraggable } from '@/composables/useDraggable'
import { useResizable } from '@/composables/useResizable'
import { useElementComponent } from '@/composables/useElementComponent'

const props = defineProps<{
  element: CanvasElement
  selected: boolean
}>()

const emit = defineEmits<ElementWrapperEvents>()

const { startDrag } = useDraggable(emit)
const { startResize } = useResizable(emit as ResizeEvents)
const { componentType, componentProps } = useElementComponent(
  toRef(props, 'element')
)

const visibleHandles = computed(() => {
  if (props.element.type === 'icon') {
    return allHandles.filter((h) => ['nw', 'ne', 'sw', 'se'].includes(h))
  }
  return allHandles
})

const wrapperStyle = computed(() => ({
  left: `${props.element.x}px`,
  top: `${props.element.y}px`,
  width: `${props.element.width}px`,
  height: `${props.element.height}px`,
  transform: `rotate(${props.element.rotation}deg)`,
  transformOrigin: 'center center',
}))

const handleMouseDown = (e: MouseEvent) => {
  emit('select')
  startDrag(e)
}

const handleResizeStart = (handle: ResizeHandle, e: MouseEvent) => {
  startResize(handle, e)
}
</script>
