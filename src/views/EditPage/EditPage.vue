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
import { calculateSnapResult } from '@/utils/snapUtils'
import { SNAP_THRESHOLD } from '@/types/snapping'
import type { SnapLine } from '@/types/snapping'

import LeftSidebar from '@/components/Sidebar/LeftBar/LeftSidebar.vue'
import RightSidebar from '@/components/Sidebar/RightBar/RightSidebar.vue'
import DragGhost from '@/components/DragGhost/DragGhost.vue'
import ElementContextBar from '@/components/ElementContextBar/ElementContextBar.vue'
import SnapLines from '@/components/SnapLines/SnapLines.vue'

const elementsStore = useElementsStore()
const dragStore = useDragStore()
const sidebarCollapsed = ref(false)
const rightSidebarCollapsed = ref(false)
const zoomStore = useZoomStore()
const { saveToFile } = useCanvasIO()
const activeSnapLines = ref<SnapLine[]>([])

const canvasRef = ref<InstanceType<typeof GridCanvas> | null>(null)

const handleKeyDown = (e: KeyboardEvent) => {
  const isMod = e.ctrlKey || e.metaKey

  // Existing save shortcut
  if (isMod && e.key === 's') {
    e.preventDefault()
    saveToFile(elementsStore.exportSnapshot())
    return
  }

  if (
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
    elementsStore.selectedElementIds.length > 0
  ) {
    e.preventDefault()

    const step = e.shiftKey ? 20 : 5
    let dx = 0
    let dy = 0

    switch (e.key) {
      case 'ArrowUp':
        dy = -step
        break
      case 'ArrowDown':
        dy = step
        break
      case 'ArrowLeft':
        dx = -step
        break
      case 'ArrowRight':
        dx = step
        break
    }

    elementsStore.selectedElementIds.forEach((id) => {
      elementsStore.updateElementPosition(id, dx, dy)
    })
    elementsStore.saveSnapshot()
  }

  // Group selected elements with Ctrl+G
  if (isMod && e.key === 'g' && !e.shiftKey) {
    e.preventDefault()
    elementsStore.groupSelectedElements()
  }

  // Ungroup with Ctrl+Shift+G
  if (isMod && e.shiftKey && e.key === 'G') {
    e.preventDefault()
    elementsStore.ungroupSelectedElements()
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

const handleCanvasClick = () => {
  elementsStore.selectElement(null)
}

const handleDrag = (
  id: string,
  deltaX: number,
  deltaY: number,
  e?: MouseEvent
) => {
  // Get the element being dragged
  const draggedElement = elementsStore.elements.find((e) => e.id === id)
  if (!draggedElement) return

  // Calculate hypothetical new position
  const newX = draggedElement.x + deltaX
  const newY = draggedElement.y + deltaY
  const hypotheticalElement = { ...draggedElement, x: newX, y: newY }

  // Check if Shift is held to disable snapping
  const isShiftHeld = e?.shiftKey ?? false

  // Calculate snapping if only one element is being dragged AND Shift is not held
  if (elementsStore.selectedElementIds.length === 1 && !isShiftHeld) {
    const snapResult = calculateSnapResult(
      hypotheticalElement,
      elementsStore.elements,
      SNAP_THRESHOLD
    )

    // Update snap lines for visualization
    activeSnapLines.value = snapResult.snapLines

    // Apply snapped position
    const adjustedDeltaX = snapResult.x - draggedElement.x
    const adjustedDeltaY = snapResult.y - draggedElement.y
    elementsStore.updateElementPosition(id, adjustedDeltaX, adjustedDeltaY)
  } else {
    // Move all selected elements together (no snapping for multi-select)
    activeSnapLines.value = []
    if (elementsStore.selectedElementIds.includes(id)) {
      elementsStore.selectedElementIds.forEach((selectedId) => {
        elementsStore.updateElementPosition(selectedId, deltaX, deltaY)
      })
    } else {
      // If dragging an unselected element, just move that one
      elementsStore.updateElementPosition(id, deltaX, deltaY)
    }
  }
}

const handleDragEnd = () => {
  activeSnapLines.value = []
  elementsStore.endDrag()
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

  // If resizing a group, also resize and reposition all children proportionally
  if (element.type === 'group') {
    const groupElement = element as import('@/types/GroupElement').GroupElement
    const oldWidth = element.width
    const oldHeight = element.height
    const oldX = element.x
    const oldY = element.y

    const scaleX = oldWidth > 0 ? newState.width / oldWidth : 1
    const scaleY = oldHeight > 0 ? newState.height / oldHeight : 1

    // Resize and reposition each child proportionally
    groupElement.childIds.forEach((childId) => {
      const child = elementsStore.elements.find((e) => e.id === childId)
      if (child) {
        // Calculate child's relative position within the old group bounds
        const relativeX = child.x - oldX
        const relativeY = child.y - oldY

        // Scale the relative position and the child's size
        elementsStore.updateElement(childId, {
          x: newState.x + relativeX * scaleX,
          y: newState.y + relativeY * scaleY,
          width: Math.max(10, child.width * scaleX),
          height: Math.max(10, child.height * scaleY),
        })
      }
    })
  }
}

const handleElementRotate = async (id: string, currentRotation: number) => {
  // Rotate all selected elements if multiple are selected
  if (
    elementsStore.selectedElementIds.length > 1 &&
    elementsStore.selectedElementIds.includes(id)
  ) {
    elementsStore.selectedElements.forEach((element) => {
      elementsStore.updateElement(
        element.id,
        {
          rotation: (element.rotation + 90) % 360,
        },
        false
      )
    })
  } else {
    const element = elementsStore.elements.find((e) => e.id === id)
    if (!element) return

    elementsStore.updateElement(
      id,
      { rotation: (currentRotation + 90) % 360 },
      false
    )

    // If rotating a group, also rotate all children around the group's center
    if (element.type === 'group') {
      const groupElement =
        element as import('@/types/GroupElement').GroupElement
      // Calculate group center
      const groupCenterX = element.x + element.width / 2
      const groupCenterY = element.y + element.height / 2

      // Rotate each child around the group's center by 90 degrees
      groupElement.childIds.forEach((childId) => {
        const child = elementsStore.elements.find((e) => e.id === childId)
        if (child) {
          // Calculate child's center
          const childCenterX = child.x + child.width / 2
          const childCenterY = child.y + child.height / 2

          // Calculate offset from group center
          const offsetX = childCenterX - groupCenterX
          const offsetY = childCenterY - groupCenterY

          // Rotate offset by 90 degrees clockwise: (x, y) -> (y, -x)
          const newOffsetX = offsetY
          const newOffsetY = -offsetX

          // Calculate new child center
          const newChildCenterX = groupCenterX + newOffsetX
          const newChildCenterY = groupCenterY + newOffsetY

          // Update child position (converting from center back to top-left)
          elementsStore.updateElement(childId, {
            x: newChildCenterX - child.width / 2,
            y: newChildCenterY - child.height / 2,
            rotation: (child.rotation + 90) % 360,
          })
        }
      })
    }
  }
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
