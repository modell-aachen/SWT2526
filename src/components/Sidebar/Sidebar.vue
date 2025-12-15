<!-- src/components/Sidebar/Sidebar.vue -->
<template>
  <aside 
    data-testid="sidebar-container"
    class="w-72 flex flex-col gap-2 p-3 bg-ma-grey-100 border-r border-ma-grey-300 shrink-0 h-full"
  >
    <h3 class="text-lg font-semibold mb-4">Sidebar</h3>

    <div class="flex flex-col gap-2 mb-4">
      <div
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-grab text-sm transition-all hover:bg-gray-200 hover:border-gray-600 active:cursor-grabbing"
        draggable="true"
        @dragstart="onDragStart($event, 'rectangle')"
      >
        Rectangle
      </div>

      <div
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-grab text-sm transition-all hover:bg-gray-200 hover:border-gray-600 active:cursor-grabbing"
        draggable="true"
        @dragstart="onDragStart($event, 'triangle')"
      >
        Triangle
      </div>

      <div
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-grab text-sm transition-all hover:bg-gray-200 hover:border-gray-600 active:cursor-grabbing"
        draggable="true"
        @dragstart="onDragStart($event, 'trapezoid')"
      >
        Trapezoid
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ShapeType } from '@/types/ShapeType'
function onDragStart(e: DragEvent, type: ShapeType) {
  if (!e.dataTransfer) return

  // store the shape type inside the drag event (so the drop area can read it)
  e.dataTransfer.setData('application/x-shape', type)

  // also set text/plain for max browser compatibility
  e.dataTransfer.setData('text/plain', type)

  e.dataTransfer.effectAllowed = 'copy'
}

defineEmits<{
  'add-shape': [type: ShapeType]
}>()
</script>

