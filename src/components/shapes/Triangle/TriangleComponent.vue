<template>
  <svg :width="width" :height="height" viewBox="0 0 100 100">
    <polygon
      :points="rotatedPoints"
      :stroke="outline"
      :fill="fill"
      stroke-width="3"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShapeRotation } from '@/composables/useShapeRotation'

const props = defineProps({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, default: 0 },
  outline: { type: String, default: '#000' },
  fill: { type: String, default: 'transparent' },
})

const { getRotatedPoints } = useShapeRotation()

const rotatedPoints = computed(() =>
  getRotatedPoints('triangle', props.rotation)
)
</script>
