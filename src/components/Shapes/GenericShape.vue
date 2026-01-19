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
      rx="50"
      ry="50"
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
      return '0,0 100,0 100,100 0,100'
    case 'triangle':
      return '50,0 100,100 0,100'
    case 'trapezoid':
      return '20,0 80,0 100,100 0,100'
    case 'chevron':
      return '0,0 60,0 100,50 60,100 0,100 40,50'
    case 'hexagon':
      return '25,0 75,0 100,50 75,100 25,100 0,50'
    case 'diamond':
      return '50,0 100,50 50,100 0,50'
    case 'parallelogram':
      return '20,0 100,0 80,100 0,100'
    case 'pentagon':
      return '50,0 100,38 82,100 18,100 0,38'
    default:
      return ''
  }
})
</script>
