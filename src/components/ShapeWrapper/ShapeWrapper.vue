<template>
  <div
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
      :outline="outline"
      :fill="fill"
    />

    <!-- Selection border and resize handles -->
    <div v-if="selected" class="absolute inset-0 pointer-events-none">
      <div
        class="absolute -inset-0.5 border-2 border-blue-500 pointer-events-none"
      ></div>

      <!-- Resize handles -->
      <div
        v-for="handle in resizeHandles"
        :key="handle.position"
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

interface Props {
  x: number
  y: number
  width: number
  height: number
  shapeType: ShapeType
  outline?: string
  fill?: string
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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

let isDragging = false
let lastMouseX = 0
let lastMouseY = 0

const handleMouseDown = (event: MouseEvent) => {
  emit('click', event)

  isDragging = true
  lastMouseX = event.clientX
  lastMouseY = event.clientY

  emit('dragStart', event)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY

    lastMouseX = e.clientX
    lastMouseY = e.clientY

    emit('drag', deltaX, deltaY)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false
      emit('dragEnd')
    }
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

let isResizing = false
let resizeHandle = ''

const handleResizeStart = (position: string, event: MouseEvent) => {
  isResizing = true
  resizeHandle = position
  lastMouseX = event.clientX
  lastMouseY = event.clientY

  emit('resizeStart', position, event)

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY

    lastMouseX = e.clientX
    lastMouseY = e.clientY

    emit('resize', resizeHandle, deltaX, deltaY)
  }

  const handleResizeEnd = () => {
    if (isResizing) {
      isResizing = false
      emit('resizeEnd')
    }
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }

  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}
</script>
