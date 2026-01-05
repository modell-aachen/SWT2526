<template>
  <Teleport to="body">
    <div
      v-if="isDragging"
      data-testid="drag-ghost"
      class="fixed pointer-events-none z-[9999] opacity-70"
      :style="ghostStyle"
    >
      <component
        :is="shapeComponent"
        :width="SHAPE_SIZE"
        :height="SHAPE_SIZE"
        outline="var(--ma-primary-600)"
        fill="var(--ma-primary-100)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDragStore } from '@/stores/drag/dragGhost'
import Rectangle from '../shapes/Rectangle/RectangleComponent.vue'
import Triangle from '../shapes/Triangle/TriangleComponent.vue'
import Trapezoid from '../shapes/Trapezoid/TrapezoidComponent.vue'

const SHAPE_SIZE = 100

const dragStore = useDragStore()
const { isDragging, draggedShapeType, ghostPosition } = storeToRefs(dragStore)

const shapeComponent = computed(() => {
  if (!draggedShapeType.value) return Rectangle

  switch (draggedShapeType.value) {
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
  left: `${ghostPosition.value.x}px`,
  top: `${ghostPosition.value.y}px`,
  width: `${SHAPE_SIZE}px`,
  height: `${SHAPE_SIZE}px`,
}))
</script>
