<template>
  <div
    class="w-full h-full flex items-center justify-center p-2 overflow-hidden"
    :style="{
      color: color,
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
    }"
  >
    {{ content }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string
  color: string
  fontSize: number
  fontFamily: string
}>()
</script>
