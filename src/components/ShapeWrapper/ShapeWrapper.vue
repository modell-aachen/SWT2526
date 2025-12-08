<template>
  <div
    data-testid="shape-wrapper"
    class="absolute select-none"
    :class="selected ? 'cursor-move' : 'cursor-pointer'"
    :style="wrapperStyle"
    @mousedown.stop="handleMouseDown"
  >
    <!-- Shape content -->
    <component
      :is="shapeComponent"
      :width="width"
      :height="height"
      :rotation="rotation"
      :outline="outline"
      :fill="fill"
    />

    <!-- Selection border and resize handles -->
    <div v-if="selected" class="absolute inset-0 pointer-events-none">
      <div
        data-testid="selection-border"
        class="absolute -inset-0.5 border-2 border-blue-500 pointer-events-none"
      ></div>

      <!-- Resize handles -->
      <div
        v-for="handle in resizeHandles"
        :key="handle.position"
        :data-testid="`resize-handle-${handle.position}`"
        class="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        :class="getCursorClass(handle.position)"
        :style="getHandleStyle(handle)"
        @mousedown.stop="handleResizeStart(handle.position, $event)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { ShapeType } from '@/types/ShapeType'
import type { ResizeHandle } from '@/types/ResizeHandle'
import Rectangle from '../shapes/Rectangle/RectangleComponent.vue'
import Triangle from '../shapes/Triangle/TriangleComponent.vue'
import Trapezoid from '../shapes/Trapezoid/TrapezoidComponent.vue'
import { useDraggable } from '@/composables/useDraggable'
import { useResizable } from '@/composables/useResizable'

interface Props {
  x: number
  y: number
  width: number
  height: number
  shapeType: ShapeType
  rotation?: number
  outline?: string
  fill?: string
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rotation: 0,
  outline: '#000',
  fill: 'transparent',
  selected: false,
})

const emit = defineEmits<{
  dragStart: [event: MouseEvent]
  drag: [deltaX: number, deltaY: number]
  dragEnd: []
  resizeStart: [handle: string, event: MouseEvent]
  resize: [handle: string, deltaX: number, deltaY: number]
  resizeEnd: []
  click: [event: MouseEvent]
}>()

const { startDrag } = useDraggable(emit)
const { startResize } = useResizable(emit)

const shapeComponent = computed(() => {
  switch (props.shapeType) {
    case 'rectangle':
      return Rectangle
    case 'triangle':
      return Triangle
    case 'trapezoid':
      return Trapezoid
    default:
      return Rectangle
  }
})

const wrapperStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  left: `${props.x}px`,
  top: `${props.y}px`,
  width: `${props.width}px`,
  height: `${props.height}px`,
  cursor: props.selected ? 'move' : 'pointer',
}))

const resizeHandles = computed<ResizeHandle[]>(() => [
  { position: 'nw', x: 0, y: 0 },
  { position: 'n', x: props.width / 2, y: 0 },
  { position: 'ne', x: props.width, y: 0 },
  { position: 'e', x: props.width, y: props.height / 2 },
  { position: 'se', x: props.width, y: props.height },
  { position: 's', x: props.width / 2, y: props.height },
  { position: 'sw', x: 0, y: props.height },
  { position: 'w', x: 0, y: props.height / 2 },
])

const getHandleStyle = (handle: ResizeHandle) => ({
  left: `${handle.x}px`,
  top: `${handle.y}px`,
})

const getCursorClass = (position: string) => {
  const cursorMap: Record<string, string> = {
    nw: 'cursor-nw-resize',
    n: 'cursor-n-resize',
    ne: 'cursor-ne-resize',
    e: 'cursor-e-resize',
    se: 'cursor-se-resize',
    s: 'cursor-s-resize',
    sw: 'cursor-sw-resize',
    w: 'cursor-w-resize',
  }
  return cursorMap[position] || 'cursor-pointer'
}

const handleMouseDown = (event: MouseEvent) => {
  startDrag(event)
}

const handleResizeStart = (position: string, event: MouseEvent) => {
  startResize(position, event)
}
</script>
