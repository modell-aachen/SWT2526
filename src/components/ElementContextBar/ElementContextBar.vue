<template>
  <ShapeContextBar
    v-if="isShape"
    :shape-width="element.width"
    :shape-height="element.height"
    :shape-y="element.y"
    :rotation="element.rotation"
    @copy="$emit('copy')"
    @duplicate="$emit('duplicate')"
    @rotate="$emit('rotate')"
    @delete="$emit('delete')"
  />
  <TextContextBar
    v-else-if="isText"
    :width="element.width"
    :height="element.height"
    :rotation="element.rotation"
    :y="element.y"
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
