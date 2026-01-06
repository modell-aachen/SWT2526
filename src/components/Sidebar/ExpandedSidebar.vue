<template>
  <aside
    data-testid="expanded-sidebar"
    class="flex flex-col h-full w-56 border-r border-ma-grey-300 bg-ma-grey-100"
  >
    <!-- Header -->
    <div class="p-3 border-b border-ma-grey-300">
      <h2 class="font-semibold text-ma-text-01">Tools</h2>
    </div>

    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto p-2">
      <SidebarGroup title="Shapes" :sidebar-collapsed="false">
        <ShapeButton
          v-for="shape in shapes"
          :key="shape"
          :shape-type="shape"
          :collapsed="false"
        />
      </SidebarGroup>
    </div>

    <!-- Footer with actions in a row -->
    <div class="p-2 border-t border-ma-grey-300">
      <div class="flex gap-1 justify-between">
        <div class="flex gap-1">
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
        </div>
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
  ClipboardPaste,
  Trash2,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SidebarGroup from './SidebarGroup.vue'
import ShapeButton from './ShapeButton.vue'
import { useShapesStore } from '@/stores/shapes/shapes'
import { useDarkMode } from '@/composables/useDarkMode'
import type { ShapeType } from '@/types/ShapeType'

defineEmits<{
  'clear-all': []
}>()

const shapes: ShapeType[] = ['rectangle', 'triangle', 'trapezoid']
const shapesStore = useShapesStore()
const { isDark, toggle: toggleDarkMode } = useDarkMode()
</script>
