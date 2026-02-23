<template>
  <div
    data-testid="canvas-container"
    class="flex-1 relative bg-bg-maincontent overflow-auto outline-none"
    tabindex="0"
    @mousedown="handleCanvasClick"
    @keydown.delete="$emit('delete-selected')"
    @keydown.backspace="$emit('delete-selected')"
    @keydown="handleKeyDown"
  >
    <svg
      data-testid="grid-svg"
      class="absolute top-0 left-0 pointer-events-none z-0 text-ma-grey-700"
      :style="containerStyle"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid"
          :width="gridSize"
          :height="gridSize"
          patternUnits="userSpaceOnUse"
        >
          <path
            data-testid="grid-pattern-path"
            :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
            fill="none"
            stroke="currentColor"
            stroke-width="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <div class="zoom-container absolute top-0 left-0" :style="containerStyle">
      <div class="zoom-content" :style="contentStyle">
        <slot />
      </div>
    </div>

    <!-- Overlay slot for elements that should move with the canvas but not scale with zoom -->
    <div
      class="absolute top-0 left-0 pointer-events-none"
      :style="overlayStyle"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useZoomStore } from '@/stores/zoom/zoom'

const props = defineProps<{
  contentWidth?: number
  contentHeight?: number
}>()

const emit = defineEmits<{
  'canvas-click': []
  'delete-selected': []
  'copy-selected': []
  paste: []
  duplicate: []
  undo: []
  redo: []
}>()

const zoomStore = useZoomStore()

const gridSize = computed(() => zoomStore.zoom * 20)

const baseWidth = computed(() =>
  props.contentWidth && props.contentWidth > 0 ? props.contentWidth : null
)

const baseHeight = computed(() =>
  props.contentHeight && props.contentHeight > 0 ? props.contentHeight : null
)

const containerStyle = computed(() => ({
  width: baseWidth.value ? `${baseWidth.value * zoomStore.zoom}px` : '100%',
  height: baseHeight.value ? `${baseHeight.value * zoomStore.zoom}px` : '100%',
  minWidth: '100%',
  minHeight: '100%',
}))

const contentStyle = computed(() => ({
  width: baseWidth.value ? `${baseWidth.value}px` : '100%',
  height: baseHeight.value ? `${baseHeight.value}px` : '100%',
  transform: `scale(${zoomStore.zoom})`,
  transformOrigin: 'top left',
}))

const overlayStyle = computed(() => ({
  width: containerStyle.value.width,
  height: containerStyle.value.height,
  minWidth: '100%',
  minHeight: '100%',
}))

const handleCanvasClick = (event: MouseEvent) => {
  if (
    event.target === event.currentTarget ||
    (event.target as HTMLElement).classList.contains('grid-pattern') ||
    (event.target as HTMLElement).classList.contains('zoom-container') ||
    (event.target as HTMLElement).classList.contains('zoom-content')
  ) {
    emit('canvas-click')
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modifierKey = isMac ? event.metaKey : event.ctrlKey

  if (modifierKey && event.key === 'z' && !event.shiftKey) {
    event.preventDefault()
    emit('undo')
  } else if (
    (modifierKey && event.key === 'z' && event.shiftKey) ||
    (modifierKey && event.key === 'y')
  ) {
    event.preventDefault()
    emit('redo')
  } else if (modifierKey && event.key === 'c') {
    event.preventDefault()
    emit('copy-selected')
  } else if (modifierKey && event.key === 'v') {
    event.preventDefault()
    emit('paste')
  } else if (modifierKey && event.key === 'd') {
    event.preventDefault()
    emit('duplicate')
  }
}
</script>
