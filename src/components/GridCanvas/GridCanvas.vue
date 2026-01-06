<template>
  <div
    data-testid="canvas-container"
    class="flex-1 relative bg-bg-maincontent overflow-auto outline-none"
    tabindex="0"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @keydown.delete="$emit('delete-selected')"
    @keydown.backspace="$emit('delete-selected')"
    @keydown="handleKeyDown"
  >
    <!-- Grid pattern -->
    <svg
      data-testid="grid-svg"
      class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 text-ma-grey-200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            data-testid="grid-pattern-path"
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            stroke-width="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <slot />

    <!-- Selection rectangle -->
    <div
      v-if="isSelecting && selectionRect"
      data-testid="selection-rectangle"
      class="absolute border-2 border-ma-primary-500 bg-ma-primary-500/10 pointer-events-none z-50"
      :style="selectionRectStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  'canvas-click': []
  'delete-selected': []
  'copy-selected': []
  paste: []
  duplicate: []
  undo: []
  redo: []
  'select-all': []
  'area-select': [
    bounds: { x: number; y: number; width: number; height: number },
  ]
}>()

// Selection rectangle state
const isSelecting = ref(false)
const selectionStart = ref<{ x: number; y: number } | null>(null)
const selectionEnd = ref<{ x: number; y: number } | null>(null)

const selectionRect = computed(() => {
  if (!selectionStart.value || !selectionEnd.value) return null

  const x = Math.min(selectionStart.value.x, selectionEnd.value.x)
  const y = Math.min(selectionStart.value.y, selectionEnd.value.y)
  const width = Math.abs(selectionEnd.value.x - selectionStart.value.x)
  const height = Math.abs(selectionEnd.value.y - selectionStart.value.y)

  return { x, y, width, height }
})

const selectionRectStyle = computed(() => {
  if (!selectionRect.value) return {}
  return {
    left: `${selectionRect.value.x}px`,
    top: `${selectionRect.value.y}px`,
    width: `${selectionRect.value.width}px`,
    height: `${selectionRect.value.height}px`,
  }
})

const handleMouseDown = (event: MouseEvent) => {
  // Only start selection on direct canvas click (not on shapes)
  if (
    event.target === event.currentTarget ||
    (event.target as HTMLElement).closest('[data-testid="grid-svg"]')
  ) {
    // Get position relative to the canvas container
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x =
      event.clientX -
      rect.left +
      (event.currentTarget as HTMLElement).scrollLeft
    const y =
      event.clientY - rect.top + (event.currentTarget as HTMLElement).scrollTop

    selectionStart.value = { x, y }
    selectionEnd.value = { x, y }
    isSelecting.value = true

    // Emit canvas click to deselect (unless shift is held for additive selection)
    if (!event.shiftKey) {
      emit('canvas-click')
    }
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isSelecting.value || !selectionStart.value) return

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x =
    event.clientX - rect.left + (event.currentTarget as HTMLElement).scrollLeft
  const y =
    event.clientY - rect.top + (event.currentTarget as HTMLElement).scrollTop

  selectionEnd.value = { x, y }
}

const handleMouseUp = () => {
  if (isSelecting.value && selectionRect.value) {
    // Only emit area-select if the rectangle has meaningful size
    if (selectionRect.value.width > 5 && selectionRect.value.height > 5) {
      emit('area-select', selectionRect.value)
    }
  }

  // Reset selection state
  isSelecting.value = false
  selectionStart.value = null
  selectionEnd.value = null
}

//TODO(jwi): Refactor Hotkey Handling into its own composable
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
  } else if (modifierKey && event.key === 'a') {
    event.preventDefault()
    emit('select-all')
  }
}
</script>
