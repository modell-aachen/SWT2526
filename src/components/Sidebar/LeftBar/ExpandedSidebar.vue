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
          v-for="shape in primaryShapes"
          :key="shape"
          :shape-type="shape"
          :collapsed="false"
        />
        <ShapePopover
          title="Advanced"
          :trigger-icon="LayoutGrid"
          :shapes="advancedShapes"
          :collapsed="false"
        />
        <CustomShapePopover
          :collapsed="false"
          @add-custom="isCustomShapeDialogOpen = true"
        />
      </SidebarGroup>

      <SidebarGroup title="Text" :sidebar-collapsed="false">
        <Button
          variant="ghost"
          class="w-full justify-start gap-2 h-9 px-2 text-ma-text-01"
          title="Add Text"
          @click="elementsStore.addText()"
        >
          <Type
            :style="{ color: defaultOutlineColor }"
            class="w-4 h-4 text-ma-text-01"
          />
          <span class="text-sm text-ma-text-01">Text</span>
        </Button>
      </SidebarGroup>

      <SidebarGroup title="Icons" :sidebar-collapsed="false">
        <IconCategoryPicker
          v-for="(category, key) in ICON_CATEGORIES"
          :key="key"
          :category="category"
          :collapsed="false"
        />
      </SidebarGroup>

      <SidebarGroup title="Templates" :sidebar-collapsed="false">
        <TemplateButton
          v-for="template in templates"
          :key="template.name"
          :template="template"
          :collapsed="false"
        />
      </SidebarGroup>

      <CustomShapeDialog
        :open="isCustomShapeDialogOpen"
        @update:open="isCustomShapeDialogOpen = $event"
      />
    </div>

    <SaveLoadButtons />
    <SidebarActions @clear-all="$emit('clear-all')" />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Type, LayoutGrid } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import SidebarGroup from '@/components/Sidebar/SidebarGroup.vue'
import ShapeButton from './ShapeButton.vue'
import ShapePopover from './ShapePopover.vue'
import CustomShapePopover from './CustomShapePopover.vue'
import IconCategoryPicker from './IconCategoryPicker.vue'
import SaveLoadButtons from './SaveLoadButtons.vue'
import SidebarActions from './SidebarActions.vue'
import CustomShapeDialog from './CustomShapeDialog.vue'
import TemplateButton from './TemplateButton.vue'
import { useElementsStore } from '@/stores/elements/elements'
import { ICON_CATEGORIES } from '@/components/Icons'
import type { ShapeType } from '@/types/ShapeType'
import { defaultOutlineColor } from '@/types/DefaultColors'
import { templates } from '@/templates'

defineEmits<{
  'clear-all': []
}>()

const isCustomShapeDialogOpen = ref(false)
const elementsStore = useElementsStore()

const primaryShapes: ShapeType[] = ['rectangle', 'chevron', 'ellipse', 'arrow']

const advancedShapes: ShapeType[] = [
  'triangle',
  'trapezoid',
  'hexagon',
  'diamond',
  'parallelogram',
  'pentagon',
  'line',
  'horizontal-line',
]
</script>
