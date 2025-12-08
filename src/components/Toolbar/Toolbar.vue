<template>
  <div class="flex gap-2 p-3 bg-gray-100 border-b border-gray-300 shrink-0">
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
    <div class="w-px bg-gray-300 mx-2"></div>
    <button
      :disabled="!hasSelectedShape"
      class="px-4 py-2 border border-blue-400 bg-blue-50 text-blue-800 rounded cursor-pointer text-sm transition-all hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('rotate-selected')"
    >
      Rotate 90°
    </button>
    <button
      :disabled="!hasSelectedShape"
      class="px-4 py-2 border border-red-400 bg-red-50 text-red-800 rounded cursor-pointer text-sm transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('delete-selected')"
    >
      Delete Selected
    </button>
    <button
      class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
      @click="$emit('clear-all')"
    >
      Clear All
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ShapeType } from '@/types/shapes'

defineProps<{
  hasSelectedShape: boolean
}>()

defineEmits<{
  'add-shape': [type: ShapeType]
  'rotate-selected': []
  'delete-selected': []
  'clear-all': []
}>()
</script>
