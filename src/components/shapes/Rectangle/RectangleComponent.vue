<template>
  <svg
    data-testid="rectangle-shape"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
  >
    <polygon
      data-testid="rectangle-polygon"
      points="5,5 95,5 95,95 5,95"
      :stroke="outline"
      :fill="fill"
      stroke-width="3"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  outline: { type: String, default: '#000' },
  fill: { type: String, default: 'transparent' },
})
</script>
