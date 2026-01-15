<template>
  <Button
    variant="ghost"
    size="icon-sm"
    data-testid="sidebar-toggle"
    class="absolute top-3 left-3 z-10 bg-ma-grey-100 border border-ma-grey-300 shadow-sm"
    title="Toggle sidebar"
    @click="$emit('toggle')"
  >
    <PanelLeftClose v-if="!isCollapsed" class="w-5 h-5 text-ma-text-01" />
    <PanelLeft v-else class="w-5 h-5 text-ma-text-01" />
  </Button>
</template>

<script setup lang="ts">
import { PanelLeft, PanelLeftClose } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{
  isCollapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>
