<template>
  <div
    data-testid="sidebar-shape-item"
    class="flex items-center justify-center p-3 bg-white border border-ma-grey-300 rounded-lg cursor-grab hover:border-ma-primary-500 hover:shadow-md transition-all select-none"
    @mousedown="handleMouseDown"
  >
    <div class="pointer-events-none">
      <component
        :is="shapeComponent"
        :width="size"
        :height="size"
        outline="#000"
        fill="transparent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ShapeType } from '@/types/ShapeType'
import { DRAG_CONTEXT_KEY, type DragContext } from '@/types/DragContext'
import Rectangle from '../shapes/Rectangle/RectangleComponent.vue'
import Triangle from '../shapes/Triangle/TriangleComponent.vue'
import Trapezoid from '../shapes/Trapezoid/TrapezoidComponent.vue'

interface Props {
  shapeType: ShapeType
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
})

const dragContext = inject<DragContext>(DRAG_CONTEXT_KEY)

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
  if (dragContext) {
    dragContext.startDrag(props.shapeType, event)
  }
}
</script>
