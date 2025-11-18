<template>
  <svg :width="width" :height="height" viewBox="0 0 100 100">
    <polygon
      points="25,5 75,5 95,95 5,95"
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
