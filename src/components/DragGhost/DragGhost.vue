<template>
  <Teleport to="body">
    <div
      v-if="dragContext?.isDragging.value"
      data-testid="drag-ghost"
      class="fixed pointer-events-none z-[9999] opacity-70"
      :style="ghostStyle"
    >
      <component
        :is="shapeComponent"
        :width="SHAPE_SIZE"
        :height="SHAPE_SIZE"
        outline="#000"
        fill="rgba(0, 0, 0, 0.1)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { DRAG_CONTEXT_KEY, type DragContext } from '@/types/DragContext'
import Rectangle from '../shapes/Rectangle/RectangleComponent.vue'
import Triangle from '../shapes/Triangle/TriangleComponent.vue'
import Trapezoid from '../shapes/Trapezoid/TrapezoidComponent.vue'

const SHAPE_SIZE = 100

const dragContext = inject<DragContext>(DRAG_CONTEXT_KEY)

const shapeComponent = computed(() => {
  if (!dragContext?.draggedShapeType.value) return Rectangle

  switch (dragContext.draggedShapeType.value) {
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

const ghostStyle = computed(() => ({
  left: `${dragContext?.ghostPosition.value.x ?? 0}px`,
  top: `${dragContext?.ghostPosition.value.y ?? 0}px`,
  width: `${SHAPE_SIZE}px`,
  height: `${SHAPE_SIZE}px`,
}))
</script>
