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
          :selected="elementsStore.selectedElementIds.includes(element.id)"
          @select="selectElement(element.id, $event)"
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

        <template #overlay>
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
  const isMod = e.ctrlKey || e.metaKey

  if (isMod && e.key === 's') {
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
  if (elementsStore.selectedElementIds.length > 0)
    elementsStore.deleteSelectedElement()
}

const selectElement = (id: string, event?: MouseEvent) => {
  // Shift+Click for multi-selection
  if (event?.shiftKey) {
    elementsStore.toggleElementSelection(id)
  } else if (elementsStore.selectedElementIds.includes(id)) {
    // If clicking on an already-selected element, don't reset selection
    // This allows dragging multiple selected elements
    return
  } else {
    elementsStore.selectElement(id)
  }
}

const handleCanvasClick = () => {
  elementsStore.selectElement(null)
}

const handleDrag = (id: string, deltaX: number, deltaY: number) => {
  // Move all selected elements together
  if (elementsStore.selectedElementIds.includes(id)) {
    elementsStore.selectedElementIds.forEach((selectedId) => {
      elementsStore.updateElementPosition(selectedId, deltaX, deltaY)
    })
  } else {
    // If dragging an unselected element, just move that one
    elementsStore.updateElementPosition(id, deltaX, deltaY)
  }
}

const handleResize = (
  id: string,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number
) => {
  const selectedIds = elementsStore.selectedElementIds

  // If multiple elements are selected, scale them all proportionally
  if (selectedIds.length > 1 && selectedIds.includes(id)) {
    // Calculate bounding box of all selected elements
    const selectedElements = elementsStore.elements.filter((e) =>
      selectedIds.includes(e.id)
    )

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    selectedElements.forEach((e) => {
      minX = Math.min(minX, e.x)
      minY = Math.min(minY, e.y)
      maxX = Math.max(maxX, e.x + e.width)
      maxY = Math.max(maxY, e.y + e.height)
    })

    const groupWidth = maxX - minX
    const groupHeight = maxY - minY

    // Calculate scale factor based on handle direction
    let scaleX = 1,
      scaleY = 1
    let anchorX = minX,
      anchorY = minY

    if (handle.includes('e')) {
      scaleX = groupWidth > 0 ? (groupWidth + deltaX) / groupWidth : 1
    }
    if (handle.includes('w')) {
      scaleX = groupWidth > 0 ? (groupWidth - deltaX) / groupWidth : 1
      anchorX = maxX
    }
    if (handle.includes('s')) {
      scaleY = groupHeight > 0 ? (groupHeight + deltaY) / groupHeight : 1
    }
    if (handle.includes('n')) {
      scaleY = groupHeight > 0 ? (groupHeight - deltaY) / groupHeight : 1
      anchorY = maxY
    }

    // Apply scale to all selected elements
    selectedElements.forEach((element) => {
      const newX = anchorX + (element.x - anchorX) * scaleX
      const newY = anchorY + (element.y - anchorY) * scaleY
      const newWidth = element.width * scaleX
      const newHeight = element.height * scaleY

      elementsStore.updateElement(element.id, {
        x: newX,
        y: newY,
        width: Math.max(10, newWidth),
        height: Math.max(10, newHeight),
      })
    })
  } else {
    // Single element resize
    const element = elementsStore.elements.find((e) => e.id === id)
    if (!element) return

    const newState = calculateNewElementState(element, handle, deltaX, deltaY)
    elementsStore.updateElement(id, newState)
  }
}

const handleElementRotate = async (id: string, currentRotation: number) => {
  elementsStore.updateElement(id, { rotation: (currentRotation + 90) % 360 })
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

  const w = el.width
  const h = el.height
  const rotation = el.rotation

  // Calculate center of element in canvas coordinates
  const centerX = el.x + w / 2
  const centerY = el.y + h / 2

  // Calculate the y-distance from center to the top-most corner of the rotated box
  // Convert angle to radians
  const rad = (rotation * Math.PI) / 180
  const absSin = Math.abs(Math.sin(rad))
  const absCos = Math.abs(Math.cos(rad))

  // The bounding box half-height is determined by projecting width and height onto the vertical axis
  const boundingBoxHalfHeight = (w * absSin + h * absCos) / 2

  // Visual top is center - half-height
  const visualTopY = centerY - boundingBoxHalfHeight
  const visualBottomY = centerY + boundingBoxHalfHeight

  // Position relative to the canvas content (0,0 is start of content)
  const leftPos = centerX * zoom
  let topPos = visualTopY * zoom - 64 // Default: 64px above

  // Flip Logic: Check if it goes off the top edge (with 10px buffer)
  if (topPos < 10) {
    // Flip to bottom
    topPos = visualBottomY * zoom + 20 // 20px padding below
  }

  return {
    left: `${leftPos}px`,
    top: `${topPos}px`,
    transform: 'translateX(-50%)',
  }
})
</script>
