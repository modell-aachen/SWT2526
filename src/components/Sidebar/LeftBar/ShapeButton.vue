<template>
  <Button
    data-testid="shape-button"
    variant="ghost"
    :size="collapsed ? 'icon-sm' : 'sm'"
    class="cursor-pointer w-full text-ma-text-01"
    :class="collapsed ? 'justify-center' : 'justify-start'"
    :title="shapeType"
    @mousedown="handleMouseDown"
    @click="handleClick"
  >
    <GenericShape
      :width="24"
      :height="24"
      :shape-type="shapeType"
      :custom-points="customPoints"
      :stroke-weight="1"
      :outline="defaultOutlineColor"
      :fill="defaultFillColor"
      class="pointer-events-none shrink-0"
    />
    <span v-if="!collapsed" class="capitalize">{{ label || shapeType }}</span>
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import type { ShapeType } from '@/types/ShapeType'
import { useDragStore } from '@/stores/drag/dragGhost'
import { useElementsStore } from '@/stores/elements/elements'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import { defaultFillColor, defaultOutlineColor } from '@/types/DefaultColors'

const props = defineProps<{
  shapeType: ShapeType
  collapsed?: boolean
  customPoints?: string
  label?: string
}>()

const dragStore = useDragStore()
const elementsStore = useElementsStore()

const mouseDownPos = ref<{ x: number; y: number } | null>(null)
const isDragging = ref(false)

const handleMouseDown = (event: MouseEvent) => {
  mouseDownPos.value = { x: event.clientX, y: event.clientY }
  isDragging.value = false

  const onMouseMove = (e: MouseEvent) => {
    if (!mouseDownPos.value) return

    const deltaX = Math.abs(e.clientX - mouseDownPos.value.x)
    const deltaY = Math.abs(e.clientY - mouseDownPos.value.y)

    // Start drag if moved more than 5px
    if (deltaX > 5 || deltaY > 5) {
      isDragging.value = true
      dragStore.startDrag(props.shapeType, event, props.customPoints)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    mouseDownPos.value = null
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const handleClick = () => {
  // Only add shape on click if we didn't drag
  if (!isDragging.value) {
    const center = dragStore.viewportCenter
    elementsStore.addShape(
      props.shapeType,
      center.x,
      center.y,
      props.customPoints
    )
  }
  isDragging.value = false
}
</script>
