<template>
  <div
    data-testid="canvas-container"
    class="flex-1 relative bg-bg-maincontent overflow-auto outline-none"
    tabindex="0"
    @mousedown="handleCanvasClick"
    @keydown.delete="$emit('delete-selected')"
    @keydown.backspace="$emit('delete-selected')"
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
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'canvas-click': []
  'delete-selected': []
}>()

const handleCanvasClick = (event: MouseEvent) => {
  // Deselect when clicking on empty canvas
  if (
    event.target === event.currentTarget ||
    (event.target as HTMLElement).classList.contains('grid-pattern')
  ) {
    emit('canvas-click')
  }
}
</script>
