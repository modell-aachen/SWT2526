<template>
  <Teleport to="body">
    <div
      v-if="isDragging && draggedShapeType"
      data-testid="drag-ghost"
      class="fixed pointer-events-none z-[9999] opacity-70"
      :style="ghostStyle"
    >
      <GenericShape
        :width="SHAPE_SIZE"
        :height="SHAPE_SIZE"
        :shape-type="draggedShapeType"
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
import GenericShape from '../Shapes/GenericShape.vue'

const SHAPE_SIZE = 100

const dragStore = useDragStore()
const { isDragging, draggedShapeType, ghostPosition } = storeToRefs(dragStore)

const ghostStyle = computed(() => ({
  left: `${ghostPosition.value.x}px`,
  top: `${ghostPosition.value.y}px`,
  width: `${SHAPE_SIZE}px`,
  height: `${SHAPE_SIZE}px`,
}))
</script>
