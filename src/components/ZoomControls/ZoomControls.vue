<template>
  <div
    data-testid="zoom-controls"
    class="absolute bottom-4 right-4 flex gap-1 bg-ma-grey-100 border border-ma-grey-300 rounded-lg p-1 shadow-sm"
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
      class="flex items-center px-2 text-sm text-ma-text-01 min-w-[3rem] justify-center"
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
</template>

<script setup lang="ts">
import { Plus, Minus, Minimize2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useZoomStore } from '@/stores/zoom/zoom'

const zoomStore = useZoomStore()
</script>
