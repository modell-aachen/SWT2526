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
        :title="title"
      >
        <component
          :is="triggerIcon"
          :style="{ color: defaultOutlineColor }"
          class="w-4 h-4 text-ma-text-01"
        />
        <span v-if="!collapsed" class="text-sm text-ma-text-01">{{
          title
        }}</span>
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
            <component :is="triggerIcon" class="w-4 h-4 text-ma-text-02" />
          </div>
          <h3 class="text-sm font-semibold tracking-wide text-ma-text-01">
            {{ title }}
          </h3>
        </div>
      </div>

      <div class="p-2 grid grid-cols-4 gap-1">
        <Button
          v-for="shape in shapes"
          :key="shape"
          variant="ghost"
          class="h-10 w-10 p-0 hover:bg-toolbar-btn-bg-hover transition-colors rounded-lg flex items-center justify-center cursor-grab"
          :title="shape"
          @mousedown="handleShapeMouseDown(shape, $event)"
        >
          <GenericShape
            :width="24"
            :height="24"
            :shape-type="shape"
            :stroke-weight="1"
            :outline="defaultOutlineColor"
            :fill="defaultFillColor"
            class="pointer-events-none"
          />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import { useDragStore } from '@/stores/drag/dragGhost'
import { defaultFillColor, defaultOutlineColor } from '@/types/DefaultColors'
import type { ShapeType } from '@/types/ShapeType'

defineProps<{
  title: string
  triggerIcon: Component
  shapes: ShapeType[]
  collapsed?: boolean
}>()

const dragStore = useDragStore()

const handleShapeMouseDown = (shapeType: ShapeType, event: MouseEvent) => {
  dragStore.startDrag(shapeType, event)
}
</script>
