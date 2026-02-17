<template>
  <div
    class="fixed bottom-[50px] z-40 transition-all duration-200 bg-ma-grey-100 border border-ma-grey-300 rounded-md shadow-lg p-2"
    :class="positionClass"
  >
    <div class="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        data-testid="zoom-out-button"
        title="Zoom out"
        @click="zoomStore.zoomOut()"
      >
        <Minus class="w-4 h-4 text-ma-text-01" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        data-testid="zoom-percentage-button"
        title="Zoom percentage"
        class="min-w-[3.5rem] justify-center px-2"
      >
        {{ zoomStore.zoomPercentage }}%
      </Button>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Minimize2, Crosshair, Plus, Minus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useZoomStore } from '@/stores/zoom/zoom'
import { useElementsStore } from '@/stores/elements/elements'

const props = defineProps<{
  rightSidebarCollapsed: boolean
}>()

const zoomStore = useZoomStore()

// Position changes based on right sidebar state
const positionClass = computed(() =>
  props.rightSidebarCollapsed ? 'right-[50px]' : 'right-[330px]'
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
