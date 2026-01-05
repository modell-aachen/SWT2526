<template>
  <div
    data-testid="edit-page-container"
    class="flex h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <Sidebar />
    <div class="flex flex-col flex-1">
    <Toolbar
      :can-undo="shapesStore.canUndo"
      :can-redo="shapesStore.canRedo"
      :has-copied-shape="shapesStore.hasCopiedShape"
      @add-shape="addShape"
      @clear-all="clearAll"
      @paste="shapesStore.pasteShape()"
      @undo="shapesStore.undo()"
      @redo="shapesStore.redo()"
    />

    <GridCanvas
      ref="canvasRef"
      @canvas-click="handleCanvasClick"
      @delete-selected="deleteSelected"
      @copy-selected="shapesStore.copySelectedShape()"
      @paste="shapesStore.pasteShape()"
      @duplicate="shapesStore.duplicateSelectedShape()"
      @undo="shapesStore.undo()"
      @redo="shapesStore.redo()"
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
        @drag="(deltaX, deltaY) => handleDrag(shape.id, deltaX, deltaY)"
        @drag-end="shapesStore.endDrag()"
        @resize="
          (handle, deltaX, deltaY) =>
            handleResize(shape.id, handle, deltaX, deltaY)
        "
        @resize-end="shapesStore.endResize()"
        @copy="shapesStore.copySelectedShape()"
        @duplicate="shapesStore.duplicateSelectedShape()"
        @rotate="shapesStore.rotateSelectedShape()"
        @delete="shapesStore.deleteSelectedShape()"
      />
    </GridCanvas>
    </div>
    <DragGhost />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useShapesStore } from '@/stores/shapes/shapes'
import { useDragStore } from '@/stores/drag/dragGhost'
import ShapeWrapper from '@/components/ShapeWrapper/ShapeWrapper.vue'
import Toolbar from '@/components/Toolbar/Toolbar.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'
import type { ShapeType } from '@/types/ShapeType'

const shapesStore = useShapesStore()
const dragStore = useDragStore()

const canvasRef = ref<InstanceType<typeof GridCanvas> | null>(null)
onMounted(() => {
  if (canvasRef.value?.$el) {
    dragStore.setCanvasElement(canvasRef.value.$el)
  }
})

watch(canvasRef, (newRef) => {
  if (newRef?.$el) {
    dragStore.setCanvasElement(newRef.$el)
  }
})

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
