<template>
  <div :class="containerClass">
    <div :class="controlsClass">
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
        class="flex items-center px-1 text-sm text-ma-text-01"
        :class="collapsed ? 'justify-center' : 'min-w-[3rem] justify-center'"
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
    </div>
    <Button
      variant="ghost"
      size="icon-sm"
      data-testid="reset-zoom-button"
      title="Reset zoom"
      @click="zoomStore.resetZoom()"
    >
      <Minimize2 class="w-4 h-4 text-ma-text-01" />
    </Button>
    <Button
      variant="ghost"
      size="icon-sm"
      data-testid="auto-fit-button"
      title="Fit automatically"
      @click="autoFit"
    >
      <Crosshair class="w-4 h-4 text-ma-text-01" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Minus, Minimize2, Crosshair } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useZoomStore } from '@/stores/zoom/zoom'
import { useElementsStore } from '@/stores/elements/elements'

const props = defineProps<{
  collapsed?: boolean
}>()

const zoomStore = useZoomStore()

const containerClass = computed(() =>
  props.collapsed
    ? 'p-2 border-t border-ma-grey-300 flex flex-col gap-1 items-center'
    : 'p-1 border-t border-ma-grey-300 flex gap-1 justify-between'
)

const controlsClass = computed(() =>
  props.collapsed ? 'flex flex-col gap-1 items-center' : 'flex gap-1'
)

const autoFit = () => {
  const elementsStore = useElementsStore()
  const container = document.querySelector('[data-testid="canvas-container"]')
  if (container) {
    zoomStore.autoFit(
      elementsStore.elements,
      container.clientWidth,
      container.clientHeight
    )
  }
}
</script>
