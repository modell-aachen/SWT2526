<template>
  <div
    class="w-full h-full flex items-center justify-center overflow-hidden"
    :style="{ color: color }"
  >
    <component
      :is="iconComponent"
      class="w-full h-full"
      :stroke-width="strokeWeight"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ICONS } from '@/components/Icons'

const props = defineProps<{
  iconType: string
  color: string
  strokeWeight: number
}>()

const iconComponent = computed(() => {
  return ICONS[props.iconType as keyof typeof ICONS] || null
})
</script>
