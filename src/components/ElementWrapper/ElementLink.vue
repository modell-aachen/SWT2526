<template>
  <a
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    class="absolute -top-3 -right-3 pointer-events-auto text-ma-text-01 bg-white border border-ma-grey-300 rounded-full p-1 shadow-md z-10 hover:bg-ma-grey-100 transition-colors"
    @mousedown.stop
  >
    <Link2 class="w-4 h-4 text-blue-600" />
  </a>
</template>

<script setup lang="ts">
import { Link2 } from 'lucide-vue-next'

defineProps<{
  link: string
}>()
</script>
