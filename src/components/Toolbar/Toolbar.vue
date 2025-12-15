<template>
  <div
    data-testid="toolbar-container"
    class="flex flex-wrap items-center gap-2 p-3 bg-ma-grey-100 border-b border-ma-grey-300 shrink-0"
  >
    <!-- Undo/Redo -->
    <WhiteboardButton
      data-testid="undo-button"
      variant="secondary"
      size="icon"
      :disabled="!canUndo"
      title="Undo"
      @click="$emit('undo')"
    >
      <Undo2 class="w-4 h-4" />
    </WhiteboardButton>
    <WhiteboardButton
      data-testid="redo-button"
      variant="secondary"
      size="icon"
      :disabled="!canRedo"
      title="Redo"
      @click="$emit('redo')"
    >
      <Redo2 class="w-4 h-4" />
    </WhiteboardButton>

    <div class="w-px h-6 bg-ma-grey-300 mx-1"></div>

    <!-- Copy/Paste/Duplicate -->
    <WhiteboardButton
      data-testid="copy-button"
      variant="secondary"
      size="icon"
      :disabled="!hasSelectedShape"
      title="Copy"
      @click="$emit('copy-selected')"
    >
      <Copy class="w-4 h-4" />
    </WhiteboardButton>
    <WhiteboardButton
      data-testid="paste-button"
      variant="secondary"
      size="icon"
      :disabled="!hasCopiedShape"
      title="Paste"
      @click="$emit('paste')"
    >
      <ClipboardPaste class="w-4 h-4" />
    </WhiteboardButton>
    <WhiteboardButton
      data-testid="duplicate-button"
      variant="secondary"
      size="icon"
      :disabled="!hasSelectedShape"
      title="Duplicate"
      @click="$emit('duplicate')"
    >
      <CopyPlus class="w-4 h-4" />
    </WhiteboardButton>

    <div class="w-px h-6 bg-ma-grey-300 mx-1"></div>

    <!-- Shape buttons with previews -->
    <WhiteboardButton
      v-for="shape in shapes"
      :key="shape.type"
      :data-testid="`add-${shape.type}-button`"
      variant="default"
      size="icon"
      :title="`Add ${shape.label}`"
      @click="$emit('add-shape', shape.type)"
    >
      <ShapeIcon :shape-type="shape.type" :size="20" stroke="white" />
    </WhiteboardButton>

    <div
      data-testid="toolbar-separator"
      class="w-px h-6 bg-ma-grey-300 mx-1"
    ></div>

    <!-- Rotate -->
    <WhiteboardButton
      data-testid="rotate-button"
      variant="secondary"
      size="icon"
      :disabled="!hasSelectedShape"
      title="Rotate 90°"
      @click="$emit('rotate-selected')"
    >
      <RotateCw class="w-4 h-4" />
    </WhiteboardButton>

    <!-- Delete -->
    <WhiteboardButton
      data-testid="delete-button"
      variant="destructive"
      size="icon"
      :disabled="!hasSelectedShape"
      title="Delete Selected"
      @click="$emit('delete-selected')"
    >
      <Trash2 class="w-4 h-4" />
    </WhiteboardButton>

    <!-- Clear All -->
    <WhiteboardButton
      data-testid="clear-all-button"
      variant="ghost"
      size="icon"
      title="Clear All"
      @click="$emit('clear-all')"
    >
      <XCircle class="w-4 h-4" />
    </WhiteboardButton>

    <div class="w-px h-6 bg-ma-grey-300 mx-1"></div>

    <!-- Dark Mode Toggle -->
    <WhiteboardButton
      data-testid="toggle-dark-mode-button"
      variant="secondary"
      size="icon"
      title="Toggle Dark Mode"
      @click="toggleDarkMode"
    >
      <Moon class="w-4 h-4" />
    </WhiteboardButton>
  </div>
</template>

<script setup lang="ts">
import type { ShapeType } from '@/types/ShapeType'
import { SHAPE_DEFINITIONS } from '@/constants/shapes'
import { WhiteboardButton } from '@/components/ui/whiteboard-button'
import ShapeIcon from './ShapeIcon.vue'
import {
  Undo2,
  Redo2,
  Copy,
  ClipboardPaste,
  CopyPlus,
  RotateCw,
  Trash2,
  XCircle,
  Moon,
} from 'lucide-vue-next'

defineProps<{
  hasSelectedShape: boolean
  hasCopiedShape: boolean
  canUndo: boolean
  canRedo: boolean
}>()

defineEmits<{
  'add-shape': [type: ShapeType]
  'rotate-selected': []
  'delete-selected': []
  'clear-all': []
  'copy-selected': []
  paste: []
  duplicate: []
  undo: []
  redo: []
}>()

// Generate shapes array from SHAPE_DEFINITIONS
const shapes = Object.entries(SHAPE_DEFINITIONS).map(([type, def]) => ({
  type: type as ShapeType,
  label: def.label,
}))

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark-mode')
}
</script>
