<template>
  <div
    data-testid="text-context-bar"
    class="absolute flex gap-1 p-1.5 bg-ma-white border border-ma-grey-300 rounded-lg shadow-lg z-50"
    :style="barStyle"
    @mousedown.stop
  >
    <button
      data-testid="context-copy-button"
      class="p-1.5 border border-ma-grey-400 bg-ma-white text-ma-grey-700 rounded cursor-pointer transition-all hover:bg-ma-grey-200 hover:border-ma-grey-500"
      title="Copy"
      @click="$emit('copy')"
    >
      <Copy class="w-4 h-4" />
    </button>
    <button
      data-testid="context-duplicate-button"
      class="p-1.5 border border-ma-grey-400 bg-ma-white text-ma-grey-700 rounded cursor-pointer transition-all hover:bg-ma-grey-200 hover:border-ma-grey-500"
      title="Duplicate"
      @click="$emit('duplicate')"
    >
      <CopyPlus class="w-4 h-4" />
    </button>
    <div class="w-px bg-ma-grey-300 mx-0.5"></div>
    <button
      data-testid="context-rotate-button"
      class="p-1.5 border border-ma-grey-400 bg-ma-white text-ma-grey-700 rounded cursor-pointer transition-all hover:bg-ma-grey-200 hover:border-ma-grey-500"
      title="Rotate 90°"
      @click="$emit('rotate')"
    >
      <RotateCw class="w-4 h-4" />
    </button>
    <div class="w-px bg-ma-grey-300 mx-0.5"></div>
    <button
      data-testid="context-delete-button"
      class="p-1.5 border border-ma-danger bg-ma-danger text-white rounded cursor-pointer transition-all hover:bg-ma-red-700"
      title="Delete"
      @click="$emit('delete')"
    >
      <Trash2 class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useContextBarPosition } from '@/composables/useContextBarPosition'
import { Copy, CopyPlus, RotateCw, Trash2 } from 'lucide-vue-next'

interface Props {
  width: number
  height: number
  y: number
  rotation?: number
}

const props = withDefaults(defineProps<Props>(), {
  rotation: 0,
})

defineEmits<{
  copy: []
  duplicate: []
  rotate: []
  delete: []
}>()

const { barStyle } = useContextBarPosition({
  width: props.width,
  height: props.height,
  y: props.y,
  rotation: props.rotation,
})
</script>
