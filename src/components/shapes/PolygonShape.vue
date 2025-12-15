<template>
  <svg
    :data-testid="`${shapeType}-shape`"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
  >
    <!-- Ellipse uses SVG ellipse element -->
    <ellipse
      v-if="shapeType === 'ellipse'"
      :data-testid="`${shapeType}-ellipse`"
      cx="50"
      cy="50"
      rx="45"
      ry="45"
      :stroke="outline"
      :fill="fill"
      stroke-width="3"
    />
    <!-- All other shapes use polygon -->
    <polygon
      v-else
      :data-testid="`${shapeType}-polygon`"
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
import type { ShapeType } from '@/types/ShapeType'

const props = withDefaults(
  defineProps<{
    shapeType: ShapeType
    width: number
    height: number
    rotation?: number
    outline?: string
    fill?: string
  }>(),
  {
    rotation: 0,
    outline: '#000',
    fill: 'transparent',
  }
)

const { getRotatedPoints } = useShapeRotation()

const rotatedPoints = computed(() =>
  getRotatedPoints(props.shapeType, props.rotation)
)
</script>
