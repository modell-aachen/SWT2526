<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" class="inline-block">
    <!-- Ellipse uses SVG ellipse element -->
    <ellipse
      v-if="shapeType === 'ellipse'"
      cx="50"
      cy="50"
      rx="40"
      ry="40"
      :stroke="stroke"
      :fill="fill"
      stroke-width="4"
    />
    <!-- All other shapes use polygon -->
    <polygon
      v-else
      :points="points"
      :stroke="stroke"
      :fill="fill"
      stroke-width="4"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getShapePoints } from '@/constants/shapes'
import type { ShapeType } from '@/types/ShapeType'

const props = withDefaults(
  defineProps<{
    shapeType: ShapeType
    size?: number
    stroke?: string
    fill?: string
  }>(),
  {
    size: 24,
    stroke: 'currentColor',
    fill: 'none',
  }
)

const points = computed(() => getShapePoints(props.shapeType))
</script>
