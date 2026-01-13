<template>
  <aside
    data-testid="collapsed-sidebar"
    class="flex flex-col h-full w-14 border-r border-ma-grey-300 bg-ma-grey-100"
  >
    <!-- Header with tool icon -->
    <div
      class="p-3 border-b border-ma-grey-300 flex items-center justify-center"
    >
      <Wrench class="w-5 h-5 text-ma-text-01" />
    </div>

    <!-- Shape buttons -->
    <div class="flex-1 overflow-y-auto p-1">
      <div class="flex flex-col gap-1">
        <ShapeButton
          v-for="shape in shapes"
          :key="shape"
          :shape-type="shape"
          collapsed
        />
      </div>
    </div>

    <!-- Zoom buttons and footer actions stacked vertically -->
    <div
      class="p-2 border-t border-ma-grey-300 flex flex-col gap-1 items-center"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="zoom-out-button"
        title="Zoom out"
        @click="zoomStore.zoomOut()"
      >
        <Minus class="w-4 h-4 text-ma-text-01" />
      </Button>
      <span
        class="flex items-center px-1 text-sm text-ma-text-01 justify-center"
      >
        {{ zoomStore.zoomPercentage }}%
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="zoom-in-button"
        title="Zoom in"
        @click="zoomStore.zoomIn()"
      >
        <Plus class="w-4 h-4 text-ma-text-01" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="auto-fit-button"
        title="Fit automatically"
        @click="zoomStore.resetZoom()"
      >
        <Minimize2 class="w-4 h-4 text-ma-text-01" />
      </Button>
    </div>
    <div class="p-2 border-t border-ma-grey-300">
      <div class="flex flex-col gap-1 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="undo-button"
          :disabled="!shapesStore.canUndo"
          title="Undo"
          @click="shapesStore.undo()"
        >
          <Undo2 class="w-4 h-4 text-ma-text-01" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="redo-button"
          :disabled="!shapesStore.canRedo"
          title="Redo"
          @click="shapesStore.redo()"
        >
          <Redo2 class="w-4 h-4 text-ma-text-01" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="paste-button"
          :disabled="!shapesStore.hasCopiedShape"
          title="Paste"
          @click="shapesStore.pasteShape()"
        >
          <ClipboardPaste class="w-4 h-4 text-ma-text-01" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="clear-all-button"
          title="Clear all"
          @click="$emit('clear-all')"
        >
          <Trash2 class="w-4 h-4 text-ma-text-01" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="dark-mode-button"
          title="Toggle dark mode"
          @click="toggleDarkMode"
        >
          <Moon v-if="isDark" class="w-4 h-4 text-ma-text-01" />
          <Sun v-else class="w-4 h-4 text-ma-text-01" />
        </Button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  Undo2,
  Redo2,
  Sun,
  Moon,
  Wrench,
  ClipboardPaste,
  Trash2,
  Plus,
  Minus,
  Minimize2,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ShapeButton from './ShapeButton.vue'
import { useShapesStore } from '@/stores/shapes/shapes'
import { useZoomStore } from '@/stores/zoom/zoom'
import { useDarkMode } from '@/composables/useDarkMode'
import type { ShapeType } from '@/types/ShapeType'

defineEmits<{
  'clear-all': []
}>()

const shapes: ShapeType[] = ['rectangle', 'triangle', 'trapezoid']
const shapesStore = useShapesStore()
const zoomStore = useZoomStore()
const { isDark, toggle: toggleDarkMode } = useDarkMode()
</script>
