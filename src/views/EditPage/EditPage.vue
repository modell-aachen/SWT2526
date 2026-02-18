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
        :content-width="canvasContentSize.width"
        :content-height="canvasContentSize.height"
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
          :selected="elementsStore.selectedElementIds.includes(element.id)"
          @select="selectElement(element.id, $event)"
          @drag="
            (deltaX, deltaY, e) => handleDrag(element.id, deltaX, deltaY, e)
          "
          @drag-end="handleDragEnd"
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

        <template #overlay>
          <!-- Snap Lines (show alignment guides during drag) -->
          <SnapLines :snap-lines="activeSnapLines" :zoom="zoomStore.zoom" />

          <!-- Context Bar (always upright, positioned based on selected element) -->
          <ElementContextBar
            v-if="elementsStore.selectedElement"
            :element="elementsStore.selectedElement"
            :style="contextBarStyle"
            class="absolute z-50 pointer-events-auto"
            @copy="elementsStore.copySelectedElement()"
            @duplicate="elementsStore.duplicateSelectedElement()"
            @rotate="
              handleElementRotate(
                elementsStore.selectedElement.id,
                elementsStore.selectedElement.rotation
              )
            "
            @delete="elementsStore.deleteSelectedElement()"
            @up="elementsStore.bringToFront()"
            @down="elementsStore.bringToBack()"
          />
        </template>
      </GridCanvas>
    </div>

    <RightSidebar :is-collapsed="rightSidebarCollapsed" />

    <FloatingZoomControls :right-sidebar-collapsed="rightSidebarCollapsed" />

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
import { resizeGroupChildren, rotateGroupChildren } from '@/utils/groupUtils'
import type { GroupElement } from '@/types/GroupElement'
import { useZoomStore } from '@/stores/zoom/zoom'
import { useCanvasIO } from '@/composables/useCanvasIO'
import { onUnmounted } from 'vue'

import LeftSidebar from '@/components/Sidebar/LeftBar/LeftSidebar.vue'
import RightSidebar from '@/components/Sidebar/RightBar/RightSidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'
import ElementContextBar from '@/components/ElementContextBar/ElementContextBar.vue'
import SnapLines from '@/components/SnapLines/SnapLines.vue'
import FloatingZoomControls from '@/components/FloatingZoomControls/FloatingZoomControls.vue'
import { useContextBarPosition } from '@/composables/useContextBarPosition'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useElementDrag } from '@/composables/useElementDrag'
import { useCanvasContentSize } from '@/composables/useCanvasContentSize'

const elementsStore = useElementsStore()
const dragStore = useDragStore()
const zoomStore = useZoomStore()

const sidebarCollapsed = ref(false)
const rightSidebarCollapsed = ref(true)

const { saveToFile } = useCanvasIO()
const { contextBarStyle } = useContextBarPosition()
const { cleanup: cleanupKeyboard } = useKeyboardShortcuts({ saveToFile })
const { handleDrag, handleDragEnd, activeSnapLines } = useElementDrag()
const { canvasContentSize } = useCanvasContentSize()

const canvasRef = ref<InstanceType<typeof GridCanvas> | null>(null)

onMounted(() => {
  if (canvasRef.value?.$el) {
    dragStore.setCanvasElement(canvasRef.value.$el)
  }
})

onUnmounted(() => {
  cleanupKeyboard()
})

watch(canvasRef, (newRef) => {
  if (newRef?.$el) {
    dragStore.setCanvasElement(newRef.$el)
  }
})

watch(
  () => elementsStore.selectedElement,
  (selected) => {
    if (selected) {
      rightSidebarCollapsed.value = false
    } else {
      rightSidebarCollapsed.value = true
    }
  }
)

const selectElement = (id: string, event?: MouseEvent) => {
  // Shift+Click for multi-selection
  if (event?.ctrlKey) {
    elementsStore.toggleElementSelection(id)
  } else if (elementsStore.selectedElementIds.includes(id)) {
    // If clicking on an already-selected element, don't reset selection
    // This allows dragging multiple selected elements
    return
  } else {
    elementsStore.selectElement(id)
  }
}

const deleteSelected = () => {
  if (elementsStore.selectedElementIds.length > 0)
    elementsStore.deleteSelectedElement()
}

const handleCanvasClick = () => {
  elementsStore.selectElement(null)
}

const handleUndo = () => {
  if (elementsStore.canUndo) elementsStore.undo()
}

const handleRedo = () => {
  if (elementsStore.canRedo) elementsStore.redo()
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
  elementsStore.updateElement(id, newState, false)

  if (element.type === 'group') {
    const oldBounds = {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    }
    const updates = resizeGroupChildren(
      element as GroupElement,
      oldBounds,
      newState,
      elementsStore.elements
    )
    updates.forEach((u) => elementsStore.updateElement(u.id, u.updates, false))
  }
}

const handleElementRotate = async (id: string, currentRotation: number) => {
  //rotate multiple selection
  if (
    elementsStore.selectedElementIds.length > 1 &&
    elementsStore.selectedElementIds.includes(id)
  ) {
    elementsStore.selectedElements.forEach((element) => {
      elementsStore.updateElement(
        element.id,
        { rotation: (element.rotation + 90) % 360 },
        false
      )
    })
  } else {
    //rotate single element
    const element = elementsStore.elements.find((e) => e.id === id)
    if (!element) return

    if (element.type === 'group') {
      //rotate group
      const { childUpdates, newGroupBounds } = rotateGroupChildren(
        element as GroupElement,
        elementsStore.elements
      )
      childUpdates.forEach((u) =>
        elementsStore.updateElement(u.id, u.updates, false)
      )
      elementsStore.updateElement(element.id, newGroupBounds, false)
    } else {
      elementsStore.updateElement(
        id,
        { rotation: (currentRotation + 90) % 360 },
        false
      )
    }
  }
  elementsStore.saveSnapshot()
}
</script>
