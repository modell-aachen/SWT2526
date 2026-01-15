<template>
  <aside
    data-testid="collapsed-sidebar"
    class="flex flex-col h-full w-14 border-r border-ma-grey-300 bg-ma-grey-100"
  >
    <div
      class="p-3 border-b border-ma-grey-300 flex items-center justify-center"
    >
      <Wrench class="w-5 h-5 text-ma-text-01" />
    </div>

    <div class="flex-1 overflow-y-auto p-1">
      <div class="flex flex-col gap-1">
        <ShapeButton
          v-for="shape in shapes"
          :key="shape"
          :shape-type="shape"
          collapsed
        />
        <Button
          variant="ghost"
          class="w-full justify-start gap-2 h-10 ml-1"
          @click="elementsStore.addText()"
        >
          <Type class="w-4 h-4 text-ma-text-01" />
        </Button>
      </div>
    </div>

    <ZoomControls collapsed />
    <SidebarActions collapsed @clear-all="$emit('clear-all')" />
  </aside>
</template>

<script setup lang="ts">
import { Wrench, Type } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ShapeButton from './ShapeButton.vue'
import ZoomControls from './ZoomControls.vue'
import SidebarActions from './SidebarActions.vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeType } from '@/types/ShapeType'

defineEmits<{
  'clear-all': []
}>()

const shapes: ShapeType[] = ['rectangle', 'triangle', 'trapezoid']
const elementsStore = useElementsStore()
</script>
