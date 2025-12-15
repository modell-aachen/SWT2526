<template>
  <div
    data-testid="toolbar-container"
    class="flex gap-2 p-3 bg-ma-grey-100 border-b border-ma-grey-300 shrink-0"
  >
    <button
      data-testid="undo-button"
      :disabled="!canUndo"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('undo')"
    >
      <Undo2 class="w-4 h-4" />
    </button>
    <button
      data-testid="redo-button"
      :disabled="!canRedo"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('redo')"
    >
      <Redo2 class="w-4 h-4" />
    </button>
    <div class="w-px bg-ma-grey-300 mx-2"></div>
    <button
      data-testid="add-rectangle-button"
      class="px-4 py-2 border border-ma-primary-500 bg-ma-primary-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-primary-600 hover:border-ma-primary-600"
      @click="$emit('add-shape', 'rectangle')"
    >
      Add Rectangle
    </button>
    <button
      data-testid="add-triangle-button"
      class="px-4 py-2 border border-ma-primary-500 bg-ma-primary-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-primary-600 hover:border-ma-primary-600"
      @click="$emit('add-shape', 'triangle')"
    >
      Add Triangle
    </button>
    <button
      data-testid="add-trapezoid-button"
      class="px-4 py-2 border border-ma-primary-500 bg-ma-primary-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-primary-600 hover:border-ma-primary-600"
      @click="$emit('add-shape', 'trapezoid')"
    >
      Add Trapezoid
    </button>
    <div data-testid="toolbar-separator" class="w-px bg-ma-grey-300 mx-2"></div>
    <button
      data-testid="rotate-button"
      :disabled="!hasSelectedShape"
      class="px-4 py-2 border border-ma-danger bg-ma-danger text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('rotate-selected')"
    >
      Rotate 90°
    </button>
    <button
      data-testid="delete-button"
      :disabled="!hasSelectedShape"
      class="px-4 py-2 border border-ma-danger bg-ma-danger text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('delete-selected')"
    >
      Delete Selected
    </button>
    <button
      data-testid="clear-all-button"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-grey-500 text-white rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-600 hover:border-ma-grey-600"
      @click="$emit('clear-all')"
    >
      Clear All
    </button>
    <div class="w-px bg-ma-grey-300 mx-2"></div>
    <button
      data-testid="toggle-dark-mode-button"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600"
      @click="toggleDarkMode"
    >
      Toggle Dark Mode
    </button>
    <Slider :default-value="[50]" :max="100" :step="1" class="w-[60%]" />
  </div>
</template>

<script setup lang="ts">
import type { ShapeType } from '@/types/ShapeType'
import Slider from '@/components/ui/slider/Slider.vue'
import { Undo2, Redo2 } from 'lucide-vue-next'

defineProps<{
  hasSelectedShape: boolean
  canUndo: boolean
  canRedo: boolean
}>()

defineEmits<{
  'add-shape': [type: ShapeType]
  'rotate-selected': []
  'delete-selected': []
  'clear-all': []
  undo: []
  redo: []
}>()
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode')
}
</script>
