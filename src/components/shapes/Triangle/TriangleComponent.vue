<template>
  <svg :width="width" :height="height" viewBox="0 0 100 100">
    <polygon
      :points="points"
      :stroke="outline"
      :fill="fill"
      stroke-width="3"
    />
  </svg>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useRotatedPoints } from '@/composables/useRotatedPoints'

const props = defineProps({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, default: 0 },
  outline: { type: String, default: '#000' },
  fill: { type: String, default: 'transparent' },
})

const basePoints = [
  { x: 50, y: 5 },  // top
  { x: 95, y: 95 }, // bottom-right
  { x: 5, y: 95 },  // bottom-left
]

const points = useRotatedPoints(basePoints, toRef(props, 'rotation'))
</script>
