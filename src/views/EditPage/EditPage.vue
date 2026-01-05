<template>
  <div
    data-testid="edit-page-container"
    class="flex h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <Sidebar />

    <div class="flex flex-col flex-1">
      <Toolbar
        :has-selected-shape="!!shapesStore.selectedShapeId"
        @add-shape="addShape"
        @rotate-selected="rotateSelected"
        @delete-selected="deleteSelected"
        @clear-all="clearAll"
      />

      <GridCanvas
        ref="canvasRef"
        @canvas-click="handleCanvasClick"
        @delete-selected="deleteSelected"
      >
        <ShapeWrapper
          v-for="shape in shapesStore.sortedShapes"
          :key="shape.id"
          :x="shape.x"
          :y="shape.y"
          :width="shape.width"
          :height="shape.height"
          :rotation="shape.rotation"
          :shape-type="shape.type"
          :outline="shape.outline"
          :fill="shape.fill"
          :selected="shape.id === shapesStore.selectedShapeId"
          @click="selectShape(shape.id)"
          @drag="(dx, dy) => handleDrag(shape.id, dx, dy)"
          @resize="(handle, dx, dy) => handleResize(shape.id, handle, dx, dy)"
        />
      </GridCanvas>
    </div>

    <DragGhost />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch } from 'vue'
import { useShapesStore } from '@/stores/shapes/shapes'
import ShapeWrapper from '@/components/ShapeWrapper/ShapeWrapper.vue'
import Toolbar from '@/components/Toolbar/Toolbar.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'
import type { ShapeType } from '@/types/ShapeType'
import { DRAG_CONTEXT_KEY } from '@/types/DragContext'
import { useDragToAdd } from '@/composables/useDragToAdd'

const shapesStore = useShapesStore()

const dragContext = useDragToAdd()
provide(DRAG_CONTEXT_KEY, dragContext)

const canvasRef = ref<InstanceType<typeof GridCanvas> | null>(null)
onMounted(() => {
  if (canvasRef.value?.$el) {
    dragContext.setCanvasElement(canvasRef.value.$el)
  }
})

watch(canvasRef, (newRef) => {
  if (newRef?.$el) {
    dragContext.setCanvasElement(newRef.$el)
  }
})

const addShape = (type: ShapeType) => {
  shapesStore.addShape(type)
}

const rotateSelected = () => {
  shapesStore.rotateSelectedShape()
}

const deleteSelected = () => {
  shapesStore.deleteSelectedShape()
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all shapes?')) {
    shapesStore.clearAll()
  }
}

const selectShape = (id: string | null) => {
  shapesStore.selectShape(id)
}

const handleCanvasClick = () => {
  shapesStore.selectShape(null)
}

const handleDrag = (id: string, deltaX: number, deltaY: number) => {
  shapesStore.updateShapePosition(id, deltaX, deltaY)
}

const handleResize = (
  id: string,
  handle: string,
  deltaX: number,
  deltaY: number
) => {
  shapesStore.updateShapeSize(id, handle, deltaX, deltaY)
}
</script>
