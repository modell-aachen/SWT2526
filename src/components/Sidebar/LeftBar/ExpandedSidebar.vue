<template>
  <aside
    data-testid="expanded-sidebar"
    class="flex flex-col h-full w-56 border-r border-ma-grey-300 bg-ma-grey-100"
  >
    <div class="p-3 border-b border-ma-grey-300">
      <h2 class="font-semibold text-ma-text-01">Tools</h2>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <SidebarGroup title="Shapes" :sidebar-collapsed="false">
        <ShapeButton
          v-for="shape in shapes"
          :key="shape"
          :shape-type="shape"
          :collapsed="false"
        />
      </SidebarGroup>
      <SidebarGroup title="Text" :sidebar-collapsed="false">
        <Button
          variant="ghost"
          class="w-full justify-start gap-2 h-9 px-2"
          @click="elementsStore.addText()"
          title="Add Text"
        >
          <Type class="w-4 h-4 text-ma-text-01" />
          <span class="text-sm text-ma-text-01">Text</span>
        </Button>
      </SidebarGroup>
    </div>

    <ZoomControls />
    <SidebarActions @clear-all="$emit('clear-all')" />
  </aside>
</template>

<script setup lang="ts">
import { Type } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SidebarGroup from '@/components/Sidebar/SidebarGroup.vue'
import ShapeButton from './ShapeButton.vue'
import ZoomControls from './ZoomControls.vue'
import SidebarActions from './SidebarActions.vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeType } from '@/types/ShapeType'

defineEmits<{
  'clear-all': []
}>()

const shapes: ShapeType[] = [
  'rectangle',
  'triangle',
  'trapezoid',
  'chevron',
  'hexagon',
  'ellipse',
  'diamond',
  'parallelogram',
  'pentagon',
]
const elementsStore = useElementsStore()
</script>
