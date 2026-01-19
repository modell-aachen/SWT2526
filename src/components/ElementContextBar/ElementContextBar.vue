<template>
  <ShapeContextBar
    v-if="isShape"
    @copy="$emit('copy')"
    @duplicate="$emit('duplicate')"
    @rotate="$emit('rotate')"
    @delete="$emit('delete')"
  />
  <TextContextBar
    v-else-if="isText"
    @copy="$emit('copy')"
    @duplicate="$emit('duplicate')"
    @rotate="$emit('rotate')"
    @delete="$emit('delete')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasElement } from '@/types/Element'
import ShapeContextBar from './ShapeContextBar.vue'
import TextContextBar from './TextContextBar.vue'

const props = defineProps<{
  element: CanvasElement
}>()

defineEmits<{
  copy: []
  duplicate: []
  rotate: []
  delete: []
}>()

const isShape = computed(() => props.element.type === 'shape')
const isText = computed(() => props.element.type === 'text')
</script>
