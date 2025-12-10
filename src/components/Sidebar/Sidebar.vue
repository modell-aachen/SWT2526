<!-- src/components/Sidebar/Sidebar.vue -->
<template>
  <aside class="w-72 bg-white dark:bg-gray-900 border-l h-full p-4 flex flex-col">
    <h3 class="text-lg font-semibold mb-4">Sidebar</h3>

    <!-- Add-Shape Buttons -->
    <div class="flex flex-col gap-2 mb-4">
      <button
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
        @click="$emit('add-shape', 'rectangle')"
      >
        Add Rectangle
      </button>

      <button
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
        @click="$emit('add-shape', 'triangle')"
      >
        Add Triangle
      </button>

      <button
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
        @click="$emit('add-shape', 'trapezoid')"
      >
        Add Trapezoid
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ShapeType } from '@/types/shapes'

defineEmits<{
  'add-shape': [type: ShapeType]
}>()
</script>

