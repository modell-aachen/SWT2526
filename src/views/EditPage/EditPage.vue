<template>
  <div
    data-testid="edit-page-container"
    class="flex flex-col h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <Toolbar
      :can-undo="shapesStore.canUndo"
      :can-redo="shapesStore.canRedo"
      :has-copied-shape="shapesStore.hasCopiedShapes"
      @add-shape="addShape"
      @clear-all="clearAll"
      @paste="shapesStore.pasteShapes()"
      @undo="shapesStore.undo()"
      @redo="shapesStore.redo()"
    />

    <GridCanvas
      @canvas-click="handleCanvasClick"
      @delete-selected="deleteSelected"
      @copy-selected="shapesStore.copySelectedShapes()"
      @paste="shapesStore.pasteShapes()"
      @duplicate="shapesStore.duplicateSelectedShapes()"
      @undo="shapesStore.undo()"
      @redo="shapesStore.redo()"
      @select-all="shapesStore.selectAll()"
      @area-select="handleAreaSelect"
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
        :selected="shapesStore.isSelected(shape.id)"
        :show-resize-handles="
          shapesStore.selectedShapeIds.length === 1 &&
          shapesStore.isSelected(shape.id)
        "
        @click="(event: MouseEvent) => selectShape(shape.id, event)"
        @drag="(deltaX, deltaY) => handleDrag(shape.id, deltaX, deltaY)"
        @drag-end="shapesStore.endDrag()"
        @resize="
          (handle, deltaX, deltaY) =>
            handleResize(shape.id, handle, deltaX, deltaY)
        "
        @resize-end="shapesStore.endResize()"
        @copy="shapesStore.copySelectedShapes()"
        @duplicate="shapesStore.duplicateSelectedShapes()"
        @rotate="shapesStore.rotateSelectedShapes()"
        @delete="shapesStore.deleteSelectedShapes()"
      />

      <!-- Multi-selection bounding box context bar -->
      <ShapeContextBar
        v-if="shapesStore.hasMultipleSelected && shapesStore.selectionBounds"
        :shape-width="shapesStore.selectionBounds.width"
        :shape-y="shapesStore.selectionBounds.y"
        :style="{
          position: 'absolute',
          left: `${shapesStore.selectionBounds.x}px`,
          top: `${shapesStore.selectionBounds.y}px`,
        }"
        :multi-select="true"
        @copy="shapesStore.copySelectedShapes()"
        @duplicate="shapesStore.duplicateSelectedShapes()"
        @delete="shapesStore.deleteSelectedShapes()"
      />
    </GridCanvas>
  </div>
</template>

<script setup lang="ts">
import { useShapesStore } from '@/stores/shapes/shapes'
import ShapeWrapper from '@/components/ShapeWrapper/ShapeWrapper.vue'
import ShapeContextBar from '@/components/ShapeContextBar/ShapeContextBar.vue'
import Toolbar from '@/components/Toolbar/Toolbar.vue'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import type { ShapeType } from '@/types/ShapeType'

const shapesStore = useShapesStore()

const addShape = (type: ShapeType) => {
  shapesStore.addShape(type)
}

const deleteSelected = () => {
  shapesStore.deleteSelectedShapes()
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all shapes?')) {
    shapesStore.clearAll()
  }
}

const selectShape = (id: string, event: MouseEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const modifierKey = isMac ? event.metaKey : event.ctrlKey

  if (event.shiftKey || modifierKey) {
    // Additive/toggle selection with Shift or Cmd/Ctrl
    shapesStore.selectShape(id, 'toggle')
  } else {
    // Replace selection
    shapesStore.selectShape(id)
  }
}

const handleCanvasClick = () => {
  shapesStore.selectShape(null)
}

const handleAreaSelect = (bounds: {
  x: number
  y: number
  width: number
  height: number
}) => {
  // Find all shapes that intersect with the selection rectangle
  const selectedIds = shapesStore.shapes
    .filter((shape) => {
      // Check if shape intersects with selection bounds
      const shapeRight = shape.x + shape.width
      const shapeBottom = shape.y + shape.height
      const boundsRight = bounds.x + bounds.width
      const boundsBottom = bounds.y + bounds.height

      return (
        shape.x < boundsRight &&
        shapeRight > bounds.x &&
        shape.y < boundsBottom &&
        shapeBottom > bounds.y
      )
    })
    .map((shape) => shape.id)

  if (selectedIds.length > 0) {
    shapesStore.selectShapes(selectedIds)
  }
}

const handleDrag = (id: string, deltaX: number, deltaY: number) => {
  // If the dragged shape is selected, move all selected shapes
  if (shapesStore.isSelected(id)) {
    shapesStore.updateSelectedShapesPosition(deltaX, deltaY)
  } else {
    // If dragging an unselected shape, select it and move only it
    shapesStore.selectShape(id)
    shapesStore.updateShapePosition(id, deltaX, deltaY)
  }
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
