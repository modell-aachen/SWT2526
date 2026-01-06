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
      data-testid="paste-button"
      :disabled="!hasCopiedShape"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="$emit('paste')"
    >
      <ClipboardPaste class="w-4 h-4" />
    </button>
    <div class="w-px bg-ma-grey-300 mx-2"></div>
    <button
      data-testid="zoom-in-button"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600"
    >
      +
    </button>
    <button
      data-testid="zoom-out-button"
      class="px-4 py-2 border border-ma-grey-500 bg-ma-white text-ma-grey-900 rounded cursor-pointer text-sm transition-all hover:bg-ma-grey-200 hover:border-ma-grey-600"
    >
      -
    </button>
    <div class="w-px bg-ma-grey-300 mx-2"></div>
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
  </div>
</template>

<script setup lang="ts">
import { Undo2, Redo2, ClipboardPaste } from 'lucide-vue-next'

defineProps<{
  hasCopiedShape: boolean
  canUndo: boolean
  canRedo: boolean
}>()

defineEmits<{
  'clear-all': []
  paste: []
  undo: []
  redo: []
}>()
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode')
}
</script>
