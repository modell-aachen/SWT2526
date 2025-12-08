<template>
  <div class="flex gap-2 p-3 bg-ma-grey-100 border-b border-ma-grey-300 shrink-0">
    <button
      class="px-4 py-2 border border-ma-primary-500 bg-ma-primary-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-primary-600 hover:border-ma-primary-600"
      @click="$emit('add-shape', 'rectangle')"
    >
      Add Rectangle
    </button>
    <button
      class="px-4 py-2 border border-ma-primary-500 bg-ma-primary-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-primary-600 hover:border-ma-primary-600"
      @click="$emit('add-shape', 'triangle')"
    >
      Add Triangle
    </button>
    <button
      class="px-4 py-2 border border-ma-primary-500 bg-ma-primary-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-primary-600 hover:border-ma-primary-600"
      @click="$emit('add-shape', 'trapezoid')"
    >
      Add Trapezoid
    </button>
    <div class="w-px bg-ma-grey-300 mx-2"></div>
    <button
      :disabled="!hasSelectedShape"
      class="px-4 py-2 border border-ma-danger bg-ma-danger text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('delete-selected')"
    >
      Delete Selected
    </button>
    <button
      class="px-4 py-2 border border-ma-grey-500 bg-ma-grey-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-600 hover:border-ma-grey-600"
      @click="$emit('clear-all')"
    >
      Clear All
    </button>
    <div class="w-px bg-ma-grey-300 mx-2"></div>
    <button
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600"
      @click="toggleDarkMode"
    >
      Toggle Dark Mode
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
  'delete-selected': []
  'clear-all': []
}>()
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode')
}
</script>
