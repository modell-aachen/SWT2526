<template>
  <div
    data-testid="element-context-bar"
    class="flex gap-1 p-1 bg-ma-grey-200 border border-ma-grey-300 rounded-lg shadow-lg items-center"
    @mousedown.stop
  >
    <CopyButtons @copy="$emit('copy')" @duplicate="$emit('duplicate')" />
    <div class="w-px h-4 bg-ma-grey-700 mx-0.5"></div>
    <RotateButton @rotate="$emit('rotate')" />
    <div class="w-px h-4 bg-ma-grey-700 mx-0.5"></div>
    <LayeringButtons @up="$emit('up')" @down="$emit('down')" />
    <div class="w-px h-4 bg-ma-grey-700 mx-0.5"></div>
    <DeleteButton @delete="$emit('delete')" />
  </div>
</template>

<script setup lang="ts">
import CopyButtons from './components/CopyButtons.vue'
import RotateButton from './components/RotateButton.vue'
import LayeringButtons from './components/LayeringButtons.vue'
import DeleteButton from './components/DeleteButton.vue'

defineEmits<{
  copy: []
  duplicate: []
  rotate: []
  delete: []
  up: []
  down: []
}>()
</script>
