<template>
  <div
    data-testid="edit-page-container"
    class="flex h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <LeftSidebar :is-collapsed="sidebarCollapsed" />

    <div class="flex flex-col flex-1 relative">
      <SidebarToggle
        :is-collapsed="sidebarCollapsed"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <GridCanvas
        ref="canvasRef"
        @canvas-click="handleCanvasClick"
        @delete-selected="deleteSelected"
        @copy-selected="elementsStore.copySelectedElement()"
        @paste="elementsStore.pasteElement()"
        @duplicate="elementsStore.duplicateSelectedElement()"
        @undo="handleUndo"
        @redo="handleRedo"
      >
        <ElementWrapper
          v-for="element in elementsStore.sortedElements"
          :key="element.id"
          :element="element"
          :selected="element.id === elementsStore.selectedElementId"
          @select="selectElement(element.id)"
          @drag="(deltaX, deltaY) => handleDrag(element.id, deltaX, deltaY)"
          @drag-end="elementsStore.endDrag()"
          @resize="
            (handle, deltaX, deltaY) =>
              handleResize(element.id, handle, deltaX, deltaY)
          "
          @resize-end="elementsStore.endResize()"
          @rotate="handleElementRotate(element.id, element.rotation)"
          @delete="elementsStore.deleteSelectedElement()"
          @copy="elementsStore.copySelectedElement()"
          @duplicate="elementsStore.duplicateSelectedElement()"
        />
      </GridCanvas>
    </div>

    <RightSidebar />

    <DragGhost />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import { useDragStore } from '@/stores/drag/dragGhost'
import ElementWrapper from '@/components/ElementWrapper/ElementWrapper.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import { calculateNewElementState } from '@/utils/elementTransforms'
import type { ResizeHandle } from '@/utils/elementTransforms'

import LeftSidebar from '@/components/Sidebar/LeftBar/LeftSidebar.vue'
import RightSidebar from '@/components/Sidebar/RightBar/RightSidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'

const elementsStore = useElementsStore()
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
  if (elementsStore.selectedElementId) elementsStore.deleteSelectedElement()
}

const selectElement = (id: string) => {
  elementsStore.selectElement(id)
}

const handleCanvasClick = () => {
  elementsStore.selectElement(null)
}

const handleDrag = (id: string, deltaX: number, deltaY: number) => {
  elementsStore.updateElementPosition(id, deltaX, deltaY)
}

const handleResize = (
  id: string,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number
) => {
  const element = elementsStore.elements.find((e) => e.id === id)
  if (!element) return

  const newState = calculateNewElementState(element, handle, deltaX, deltaY)

  elementsStore.updateElement(id, newState)
}

const handleElementRotate = (id: string, currentRotation: number) => {
  elementsStore.updateElement(id, { rotation: (currentRotation + 90) % 360 })
  elementsStore.saveSnapshot()
}

const handleUndo = () => {
  if (elementsStore.canUndo) elementsStore.undo()
}

const handleRedo = () => {
  if (elementsStore.canRedo) elementsStore.redo()
}
</script>
