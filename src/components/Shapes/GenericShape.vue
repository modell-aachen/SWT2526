<template>
  <svg
    :data-testid="`${shapeType}-shape`"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    style="overflow: visible"
  >
    <!-- Ellipse uses a different SVG element -->
    <ellipse
      v-if="shapeType === 'ellipse'"
      :data-testid="`${shapeType}-ellipse`"
      cx="50"
      cy="50"
      rx="45"
      ry="45"
      :stroke="outline"
      :fill="fill"
      :stroke-width="strokeWeight"
      vector-effect="non-scaling-stroke"
    />
    <!-- All other shapes use polygon -->
    <polygon
      v-else
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
    case 'chevron':
      return '5,5 70,5 95,50 70,95 5,95 30,50'
    case 'hexagon':
      return '25,5 75,5 95,50 75,95 25,95 5,50'
    case 'diamond':
      return '50,5 95,50 50,95 5,50'
    case 'parallelogram':
      return '20,5 95,5 80,95 5,95'
    case 'pentagon':
      return '5,20 5,80 70,80 95,50 70,20'
    default:
      return ''
  }
})
</script>
