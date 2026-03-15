<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        :class="[
          'gap-2 text-ma-text-01',
          collapsed
            ? 'w-10 h-10 p-0 justify-center'
            : 'w-full h-9 px-2 justify-start',
        ]"
        title="Custom Shapes"
      >
        <Pencil
          :style="{ color: defaultOutlineColor }"
          class="w-4 h-4 text-ma-text-01"
        />
        <span v-if="!collapsed" class="text-sm text-ma-text-01">Custom</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="p-0 shadow-xl border border-ma-grey-300 bg-ma-grey-100 rounded-xl overflow-hidden flex flex-col"
      align="start"
      side="right"
      :side-offset="10"
      :style="{ width: '200px' }"
    >
      <div
        class="flex items-center justify-between p-3 border-b border-ma-grey-300 bg-transparent"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="shadow-sm border border-ma-grey-300 bg-ma-grey-100 p-1 rounded-lg"
          >
            <Pencil class="w-4 h-4 text-ma-text-02" />
          </div>
          <h3 class="text-sm font-semibold tracking-wide text-ma-text-01">
            Custom Shapes
          </h3>
        </div>
      </div>

      <div class="p-2 grid grid-cols-4 gap-1">
        <Button
          v-for="shape in elementsStore.customShapes"
          :key="shape.name"
          variant="ghost"
          class="h-10 w-10 p-0 hover:bg-toolbar-btn-bg-hover transition-colors rounded-lg flex items-center justify-center cursor-grab"
          :title="shape.name"
          @mousedown="handleCustomShapeMouseDown(shape.points, $event)"
        >
          <GenericShape
            :width="24"
            :height="24"
            shape-type="custom"
            :custom-points="shape.points"
            :stroke-weight="1"
            :outline="defaultOutlineColor"
            :fill="defaultFillColor"
            class="pointer-events-none"
          />
        </Button>

        <Button
          variant="ghost"
          class="h-10 w-10 p-0 hover:bg-toolbar-btn-bg-hover transition-colors rounded-lg flex items-center justify-center"
          title="Add Custom Shape"
          @click="$emit('add-custom')"
        >
          <Plus class="w-5 h-5 text-ma-text-02" />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Pencil, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import { useDragStore } from '@/stores/drag/dragGhost'
import { useElementsStore } from '@/stores/elements/elements'
import { defaultFillColor, defaultOutlineColor } from '@/types/DefaultColors'

defineProps<{
  collapsed?: boolean
}>()

defineEmits<{
  'add-custom': []
}>()

const dragStore = useDragStore()
const elementsStore = useElementsStore()

const handleCustomShapeMouseDown = (points: string, event: MouseEvent) => {
  dragStore.startDrag('custom', event, points)
}
</script>
