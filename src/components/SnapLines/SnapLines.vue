<template>
  <svg
    v-if="snapLines.length > 0"
    class="absolute top-0 left-0 w-full h-full pointer-events-none snap-lines"
    data-testid="snap-lines-svg"
  >
    <g v-for="(line, index) in snapLines" :key="index">
      <line
        v-if="line.axis === 'horizontal'"
        :data-testid="`snap-line-horizontal-${index}`"
        :x1="`${line.start * zoom}px`"
        :y1="`${line.position * zoom}px`"
        :x2="`${line.end * zoom}px`"
        :y2="`${line.position * zoom}px`"
      />
      <line
        v-else
        :data-testid="`snap-line-vertical-${index}`"
        :x1="`${line.position * zoom}px`"
        :y1="`${line.start * zoom}px`"
        :x2="`${line.position * zoom}px`"
        :y2="`${line.end * zoom}px`"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { SnapLine } from '@/types/snapping'

defineProps<{
  snapLines: SnapLine[]
  zoom: number
}>()
</script>

<style scoped>
.snap-lines line {
  stroke: var(--blue-400);
  stroke-width: 1.5px;
  stroke-dasharray: 4 2;
}
</style>
