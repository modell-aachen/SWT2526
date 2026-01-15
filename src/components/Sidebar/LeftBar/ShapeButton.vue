<template>
  <Button
    data-testid="shape-button"
    variant="ghost"
    :size="collapsed ? 'icon-sm' : 'sm'"
    class="cursor-grab w-full text-ma-text-01"
    :class="collapsed ? 'justify-center' : 'justify-start'"
    :title="shapeType"
    @mousedown="handleMouseDown"
  >
    <GenericShape
      :width="24"
      :height="24"
      :shape-type="shapeType"
      :stroke-weight="1"
      outline="currentColor"
      fill="none"
      class="pointer-events-none shrink-0"
    />
    <span v-if="!collapsed" class="capitalize">{{ shapeType }}</span>
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { ShapeType } from '@/types/ShapeType'
import { useDragStore } from '@/stores/drag/dragGhost'
import GenericShape from '@/components/Shapes/GenericShape.vue'

const props = defineProps<{
  shapeType: ShapeType
  collapsed?: boolean
}>()

const dragStore = useDragStore()

const handleMouseDown = (event: MouseEvent) => {
  dragStore.startDrag(props.shapeType, event)
}
</script>
