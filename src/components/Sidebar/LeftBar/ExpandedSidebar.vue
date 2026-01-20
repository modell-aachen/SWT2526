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
          class="w-full justify-start gap-2 h-9 px-2 text-ma-text-01"
          @click="elementsStore.addText()"
          title="Add Text"
        >
          <Type class="w-4 h-4 text-ma-text-01" />
          <span class="text-sm text-ma-text-01">Text</span>
        </Button>
      </SidebarGroup>
      <SidebarGroup title="Custom Shapes" :sidebar-collapsed="false">
        <ShapeButton
          v-for="shape in elementsStore.customShapes"
          :key="shape.name"
          shape-type="custom"
          :custom-points="shape.points"
          :label="shape.name"
          :collapsed="false"
        />
        <Button
          variant="ghost"
          class="w-full justify-start gap-2 h-9 px-2 text-ma-text-01"
          @click="isCustomShapeDialogOpen = true"
          title="Add Custom Shape"
        >
          <Plus class="w-6 h-6" />
          <span class="text-xs">Add</span>
        </Button>
      </SidebarGroup>

      <CustomShapeDialog
        :open="isCustomShapeDialogOpen"
        @update:open="isCustomShapeDialogOpen = $event"
      />
    </div>

    <ZoomControls />
    <SidebarActions @clear-all="$emit('clear-all')" />
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Type, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SidebarGroup from '@/components/Sidebar/SidebarGroup.vue'
import ShapeButton from './ShapeButton.vue'
import ZoomControls from './ZoomControls.vue'
import SidebarActions from './SidebarActions.vue'
import CustomShapeDialog from './CustomShapeDialog.vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeType } from '@/types/ShapeType'

defineEmits<{
  'clear-all': []
}>()

const isCustomShapeDialogOpen = ref(false)
const elementsStore = useElementsStore()

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

onMounted(() => {
  // Load custom shapes from local storage (handled by store init if exists, or simple persistence)
  // elementsStore.init() // Assuming init exists or is handled
})
</script>
