<template>
  <Button
    data-testid="shape-button"
    variant="ghost"
    :size="collapsed ? 'icon-sm' : 'sm'"
    class="cursor-grab w-full text-ma-text-01"
    :class="collapsed ? 'justify-center' : 'justify-start'"
    :title="shapeType"
    @mousedown="handleMouseDown"
  >
    <component
      :is="shapeComponent"
      :width="16"
      :height="16"
      outline="currentColor"
      fill="none"
      class="pointer-events-none shrink-0"
    />
    <span v-if="!collapsed" class="capitalize">{{ shapeType }}</span>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import type { ShapeType } from '@/types/ShapeType'
import { useDragStore } from '@/stores/drag/dragGhost'
import Rectangle from '@/components/shapes/Rectangle/RectangleComponent.vue'
import Triangle from '@/components/shapes/Triangle/TriangleComponent.vue'
import Trapezoid from '@/components/shapes/Trapezoid/TrapezoidComponent.vue'

const props = defineProps<{
  shapeType: ShapeType
  collapsed?: boolean
}>()

const dragStore = useDragStore()

const shapeComponent = computed(() => {
  switch (props.shapeType) {
    case 'rectangle':
      return Rectangle
    case 'triangle':
      return Triangle
    case 'trapezoid':
      return Trapezoid
    default:
      return Rectangle
  }
})

const handleMouseDown = (event: MouseEvent) => {
  dragStore.startDrag(props.shapeType, event)
}
</script>
