<template>
  <div
    data-testid="edit-page-container"
    class="flex h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <LeftSidebar :is-collapsed="sidebarCollapsed" />

    <div class="flex flex-col flex-1 relative">
      <SidebarToggle
        side="left"
        :is-collapsed="sidebarCollapsed"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <SidebarToggle
        v-if="elementsStore.selectedElement"
        side="right"
        :is-collapsed="rightSidebarCollapsed"
        @toggle="rightSidebarCollapsed = !rightSidebarCollapsed"
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
          @rotate="handleElementRotate(element.id)"
          @delete="elementsStore.deleteSelectedElement()"
          @copy="elementsStore.copySelectedElement()"
          @duplicate="elementsStore.duplicateSelectedElement()"
        />

        <template #overlay>
          <!-- Context Bar (always upright, positioned based on selected element) -->
          <ElementContextBar
            v-if="elementsStore.selectedElement"
            :element="elementsStore.selectedElement"
            :style="contextBarStyle"
            class="absolute z-50 pointer-events-auto"
            @copy="elementsStore.copySelectedElement()"
            @duplicate="elementsStore.duplicateSelectedElement()"
            @rotate="handleElementRotate(elementsStore.selectedElement.id)"
            @delete="elementsStore.deleteSelectedElement()"
          />
        </template>
      </GridCanvas>
    </div>

    <RightSidebar :is-collapsed="rightSidebarCollapsed" />

    <DragGhost />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import { useDragStore } from '@/stores/drag/dragGhost'
import ElementWrapper from '@/components/ElementWrapper/ElementWrapper.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import { calculateNewElementState } from '@/utils/elementTransforms'
import type { ResizeHandle } from '@/utils/elementTransforms'
import { useZoomStore } from '@/stores/zoom/zoom'
import { useCanvasIO } from '@/composables/useCanvasIO'

import LeftSidebar from '@/components/Sidebar/LeftBar/LeftSidebar.vue'
import RightSidebar from '@/components/Sidebar/RightBar/RightSidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'
import ElementContextBar from '@/components/ElementContextBar/ElementContextBar.vue'

const elementsStore = useElementsStore()
const dragStore = useDragStore()
const sidebarCollapsed = ref(false)
const rightSidebarCollapsed = ref(false)
const zoomStore = useZoomStore()
const { saveToFile } = useCanvasIO()

const canvasRef = ref<InstanceType<typeof GridCanvas> | null>(null)

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveToFile(elementsStore.exportSnapshot())
  }
}

onMounted(() => {
  if (canvasRef.value?.$el) {
    dragStore.setCanvasElement(canvasRef.value.$el)
  }
  window.addEventListener('keydown', handleKeyDown)
})

import { onUnmounted } from 'vue'

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
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

const handleElementRotate = async (id: string) => {
  const element = elementsStore.elements.find((e) => e.id === id)
  if (!element) return

  // Swap width and height to simulate rotation
  const newWidth = element.height
  const newHeight = element.width

  // Adjust position to keep center in same place
  const centerX = element.x + element.width / 2
  const centerY = element.y + element.height / 2
  const newX = centerX - newWidth / 2
  const newY = centerY - newHeight / 2

  elementsStore.updateElement(id, {
    width: newWidth,
    height: newHeight,
    x: newX,
    y: newY,
  })
  elementsStore.saveSnapshot()
}

const handleUndo = () => {
  if (elementsStore.canUndo) elementsStore.undo()
}

const handleRedo = () => {
  if (elementsStore.canRedo) elementsStore.redo()
}

// Position context bar above/below the selected element
const contextBarStyle = computed(() => {
  const el = elementsStore.selectedElement
  const zoom = zoomStore.zoom
  if (!el) return {}

  // Calculate center of element in canvas coordinates
  const centerX = el.x + el.width / 2

  // Position relative to the canvas content (0,0 is start of content)
  const leftPos = centerX * zoom
  let topPos = el.y * zoom - 64 // Default: 64px above

  // Flip Logic: Check if it goes off the top edge (with 10px buffer)
  if (topPos < 10) {
    // Flip to bottom
    topPos = (el.y + el.height) * zoom + 20 // 20px padding below
  }

  return {
    left: `${leftPos}px`,
    top: `${topPos}px`,
    transform: 'translateX(-50%)',
  }
})
</script>
