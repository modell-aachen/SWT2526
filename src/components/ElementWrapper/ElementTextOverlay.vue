<template>
  <div :style="textBoundsStyle">
    <div
      class="absolute -inset-3 border-2 border-red-500 pointer-events-none"
    ></div>
    <span :style="textStyle">
      {{ element.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ShapeElement } from '@/types/Element'

const props = defineProps<{
  element: ShapeElement
}>()

const textBoundsStyle = computed(() => {
  const el = props.element

  return {
    position: 'absolute',
    top: '0',
    left: '0',
    width: `${el.width}px`,
    height: `${el.height}px`,
    transform: `rotate(-${el.rotation}deg)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  }
})

const textStyle = computed(() => {
  const el = props.element
  return {
    color: el.textColor || '#000000',
    fontSize: `${el.fontSize || 16}px`,
    fontFamily: el.fontFamily || 'Arial',
    textAlign: 'center' as const,
    whiteSpace: 'pre-wrap' as const,
    overflowWrap: 'break-word' as const,
    lineHeight: '1.2',
    userSelect: 'none' as const,
  }
})
</script>
