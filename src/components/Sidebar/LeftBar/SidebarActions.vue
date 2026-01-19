<template>
  <div :class="containerClass">
    <div :class="buttonsClass">
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="undo-button"
        :disabled="!elementsStore.canUndo"
        title="Undo"
        @click="elementsStore.undo()"
      >
        <Undo2 class="w-4 h-4 text-ma-text-01" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="redo-button"
        :disabled="!elementsStore.canRedo"
        title="Redo"
        @click="elementsStore.redo()"
      >
        <Redo2 class="w-4 h-4 text-ma-text-01" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="paste-button"
        :disabled="!elementsStore.hasCopiedElement"
        title="Paste"
        @click="elementsStore.pasteElement()"
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
      <Sun v-if="isDark" class="w-4 h-4 text-ma-text-01" />
      <Moon v-else class="w-4 h-4 text-ma-text-01" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Undo2,
  Redo2,
  Sun,
  Moon,
  ClipboardPaste,
  Trash2,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useElementsStore } from '@/stores/elements/elements'
import { useDarkMode } from '@/composables/useDarkMode'

const props = defineProps<{
  collapsed?: boolean
}>()

defineEmits<{
  'clear-all': []
}>()

const elementsStore = useElementsStore()
const { isDark, toggle: toggleDarkMode } = useDarkMode()

const containerClass = computed(() =>
  props.collapsed
    ? 'p-2 border-t border-ma-grey-300 flex flex-col gap-1 items-center'
    : 'p-2 border-t border-ma-grey-300 flex gap-1 justify-between'
)

const buttonsClass = computed(() =>
  props.collapsed ? 'flex flex-col gap-1 items-center' : 'flex gap-1'
)
</script>
