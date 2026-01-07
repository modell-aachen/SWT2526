<template>
  <div
    data-testid="edit-page-container"
    class="flex h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <LeftSidebar :is-collapsed="sidebarCollapsed" />

    <div class="flex flex-col flex-1 relative">
      <!-- Floating sidebar toggle -->
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="sidebar-toggle"
        class="absolute top-3 left-3 z-10 bg-ma-grey-100 border border-ma-grey-300 shadow-sm"
        title="Toggle sidebar"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <PanelLeftClose
          v-if="!sidebarCollapsed"
          class="w-5 h-5 text-ma-text-01"
        />
        <PanelLeft v-else class="w-5 h-5 text-ma-text-01" />
      </Button>

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
          :link="shape.link"
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
        <ZoomControls />
      </GridCanvas>
    </div>

    <RightSidebar />

    <DragGhost />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { PanelLeft, PanelLeftClose } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useShapesStore } from '@/stores/shapes/shapes'
import { useDragStore } from '@/stores/drag/dragGhost'
import ShapeWrapper from '@/components/ShapeWrapper/ShapeWrapper.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'

import LeftSidebar from '@/components/Sidebar/LeftSidebar.vue'
import RightSidebar from '@/components/Sidebar/RightSidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'
import ZoomControls from '@/components/ZoomControls/ZoomControls.vue'

const shapesStore = useShapesStore()
const dragStore = useDragStore()
const sidebarCollapsed = ref(false)

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

const deleteSelected = () => {
  shapesStore.deleteSelectedShape()
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
