<template>
  <div
    data-testid="edit-page-container"
    class="flex flex-col h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <Toolbar
      :has-selected-shape="!!shapesStore.selectedShapeId"
      @add-shape="addShape"
      @delete-selected="deleteSelected"
      @clear-all="clearAll"
    />

    <GridCanvas
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
        :shape-type="shape.type"
        :outline="shape.outline"
        :fill="shape.fill"
        :selected="shape.id === shapesStore.selectedShapeId"
        @click="selectShape(shape.id)"
        @drag="(deltaX, deltaY) => handleDrag(shape.id, deltaX, deltaY)"
        @resize="
          (handle, deltaX, deltaY) =>
            handleResize(shape.id, handle, deltaX, deltaY)
        "
      />
    </GridCanvas>
  </div>
</template>

<script setup lang="ts">
import { useShapesStore } from '@/stores/shapes/shapes'
import ShapeWrapper from '@/components/ShapeWrapper/ShapeWrapper.vue'
import Toolbar from '@/components/Toolbar/Toolbar.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import type { ShapeType } from '@/types/ShapeType'

const shapesStore = useShapesStore()

const addShape = (type: ShapeType) => {
  shapesStore.addShape(type)
}

const deleteSelected = () => {
  shapesStore.deleteSelectedShape()
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all shapes?')) {
    shapesStore.clearAll()
  }
}

const selectShape = (id: string) => {
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
