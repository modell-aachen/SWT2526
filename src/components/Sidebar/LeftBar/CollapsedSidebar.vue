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
          v-for="shape in primaryShapes"
          :key="shape"
          :shape-type="shape"
          collapsed
        />
        <LinesArrowsPopover
          title="Lines & Arrows"
          :trigger-icon="ArrowLeftRight"
          :shapes="linesAndArrowsShapes"
          collapsed
        />
        <ShapePopover
          title="Advanced"
          :trigger-icon="LayoutGrid"
          :shapes="advancedShapes"
          collapsed
        />
        <CustomShapePopover
          collapsed
          @add-custom="isCustomShapeDialogOpen = true"
        />

        <div class="w-full h-px bg-ma-grey-300 my-1" />

        <Button
          variant="ghost"
          class="w-10 h-10 p-0 justify-center ml-1"
          title="Add Text"
          @click="addTextAtCenter"
        >
          <Type
            :style="{ color: defaultOutlineColor }"
            class="w-4 h-4 text-ma-text-01"
          />
        </Button>

        <div class="w-full h-px bg-ma-grey-300 my-1" />

        <IconCategoryPicker
          v-for="(category, key) in ICON_CATEGORIES"
          :key="key"
          :category="category"
          collapsed
        />

        <div class="w-full h-px bg-ma-grey-300 my-1" />

        <TemplateButton
          v-for="template in templates"
          :key="template.name"
          :template="template"
          collapsed
        />
      </div>
    </div>

    <CustomShapeDialog
      :open="isCustomShapeDialogOpen"
      @update:open="isCustomShapeDialogOpen = $event"
    />

    <SaveLoadButtons collapsed />
    <SidebarActions collapsed @clear-all="$emit('clear-all')" />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, Type, LayoutGrid, ArrowLeftRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ShapeButton from './ShapeButton.vue'
import LinesArrowsPopover from './LinesArrowsPopover.vue'
import ShapePopover from './ShapePopover.vue'
import CustomShapePopover from './CustomShapePopover.vue'
import IconCategoryPicker from './IconCategoryPicker.vue'
import SaveLoadButtons from './SaveLoadButtons.vue'
import SidebarActions from './SidebarActions.vue'
import CustomShapeDialog from './CustomShapeDialog.vue'
import TemplateButton from './TemplateButton.vue'
import { useElementsStore } from '@/stores/elements/elements'
import { useDragStore } from '@/stores/drag/dragGhost'
import { ICON_CATEGORIES } from '@/components/Icons'
import type { ShapeType } from '@/types/ShapeType'
import { defaultOutlineColor } from '@/types/DefaultColors'
import { templates } from '@/templates'

defineEmits<{
  'clear-all': []
}>()

const isCustomShapeDialogOpen = ref(false)
const elementsStore = useElementsStore()
const dragStore = useDragStore()

const addTextAtCenter = () => {
  const center = dragStore.viewportCenter
  elementsStore.addText(center.x, center.y)
}

const primaryShapes: ShapeType[] = ['rectangle', 'chevron', 'ellipse']

const linesAndArrowsShapes: ShapeType[] = [
  'line',
  'diagonal-line',
  'arrow',
  'double-arrow',
  'thick-arrow',
  'double-thick-arrow',
]

const advancedShapes: ShapeType[] = [
  'triangle',
  'trapezoid',
  'hexagon',
  'diamond',
  'parallelogram',
  'pentagon',
  'right-angle',
  'snake',
  'spike',
]
</script>
