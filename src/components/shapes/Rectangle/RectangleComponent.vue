<template>
  <svg
    data-testid="rectangle-shape"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
  >
    <polygon
      data-testid="rectangle-polygon"
      points="5,5 95,5 95,95 5,95"
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
  getRotatedPoints('rectangle', props.rotation)
)
</script>
