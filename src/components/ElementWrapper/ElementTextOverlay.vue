<template>
  <div :style="textBoundsStyle">
    <span :style="textStyle">
      {{ element.content }}
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
  const rot = el.rotation || 0
  const isRotated90 = Math.abs(rot % 180) === 90

  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${isRotated90 ? el.height : el.width}px`,
    height: `${isRotated90 ? el.width : el.height}px`,
    transform: `translate(-50%, -50%) rotate(${-rot}deg)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  } as const
})

const textStyle = computed(() => {
  const el = props.element
  return {
    color: el.color || '#000000',
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
