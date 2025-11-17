<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <!-- Toolbar -->
<<<<<<< HEAD
    <div
      class="flex gap-2 p-3 bg-gray-100 border-b border-gray-300 flex-shrink-0"
    >
      <button
        @click="addShape('rectangle')"
=======
    <div class="flex gap-2 p-3 bg-gray-100 border-b border-gray-300 shrink-0">
      <button 
        @click="addShape('rectangle')" 
>>>>>>> 19bbd08 (feat: AI-Slop Tests for the AI-Slop Code)
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
      >
        Add Rectangle
      </button>
      <button
        @click="addShape('triangle')"
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
      >
        Add Triangle
      </button>
      <button
        @click="addShape('trapezoid')"
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
      >
        Add Trapezoid
      </button>
      <div class="w-px bg-gray-300 mx-2"></div>
      <button
        @click="deleteSelected"
        :disabled="!shapesStore.selectedShapeId"
        class="px-4 py-2 border border-red-400 bg-red-50 text-red-800 rounded cursor-pointer text-sm transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete Selected
      </button>
      <button
        @click="clearAll"
        class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all hover:bg-gray-200 hover:border-gray-600"
      >
        Clear All
      </button>
    </div>

    <!-- Canvas with grid -->
    <div
      class="flex-1 relative bg-white overflow-auto outline-none"
      @mousedown="handleCanvasClick"
      @keydown.delete="deleteSelected"
      @keydown.backspace="deleteSelected"
      tabindex="0"
    >
      <!-- Grid pattern -->
      <svg
        class="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e0e0e0"
              stroke-width="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <!-- Shapes -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShapesStore } from '@/stores/shapes'
import ShapeWrapper from '@/components/ShapeWrapper.vue'
import type { ShapeType } from '@/types/shapes'

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

const handleCanvasClick = (event: MouseEvent) => {
  // Deselect when clicking on empty canvas
  if (
    event.target === event.currentTarget ||
    (event.target as HTMLElement).classList.contains('grid-pattern')
  ) {
    shapesStore.selectShape(null)
  }
}

const handleDrag = (id: string, deltaX: number, deltaY: number) => {
  shapesStore.updateShapePosition(id, deltaX, deltaY)
}

<<<<<<< HEAD
const handleResize = (
  id: string,
  handle: string,
  deltaX: number,
  deltaY: number
) => {
  shapesStore.updateShapeSize(id, handle, deltaX, deltaY)
}
=======
const handleResize = (id: string, handle: string, deltaX: number, deltaY: number) => {
  shapesStore.updateShapeSize(id, handle, deltaX, deltaY);
};
>>>>>>> 19bbd08 (feat: AI-Slop Tests for the AI-Slop Code)
</script>
