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
  const rot = el.rotation || 0
  const isRotated90 = Math.abs(rot % 180) === 90

  // Standard (no rotation or 180): match shape w/h
  let w = el.width
  let h = el.height

  // Rotated 90 or 270: swap w/h because the container is counter-rotated
  if (isRotated90) {
    w = el.height
    h = el.width
  }

  // Calculate center offset to keep it centered
  // When rotated, the top-left corner shifts. We use a transform translation to re-center.
  // The logic:
  // 1. Start at center of parent (50% 50%)
  // 2. Translate back by half of TEXT container size
  // 3. Counter-rotate

  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${w}px`,
    height: `${h}px`,
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
