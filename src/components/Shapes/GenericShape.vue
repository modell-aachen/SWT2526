<template>
  <svg
    :data-testid="`${shapeType}-shape`"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    style="overflow: visible"
  >
    <polygon
      :data-testid="`${shapeType}-polygon`"
      :points="points"
      :stroke="outline"
      :fill="fill"
      :stroke-width="strokeWeight"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  shapeType: { type: String, required: true },
  strokeWeight: { type: Number, default: 3 },
  outline: { type: String, default: '#000' },
  fill: { type: String, default: 'transparent' },
})

const points = computed(() => {
  switch (props.shapeType) {
    case 'rectangle':
      return '5,5 95,5 95,95 5,95'
    case 'triangle':
      return '50,5 95,95 5,95'
    case 'trapezoid':
      return '20,5 80,5 95,95 5,95'
    default:
      return ''
  }
})
</script>
