<template>
  <CollapsedSidebar
    v-if="isCollapsed"
    data-testid="app-sidebar"
    @clear-all="handleClearAll"
  />
  <ExpandedSidebar
    v-else
    data-testid="app-sidebar"
    @clear-all="handleClearAll"
  />
</template>

<script setup lang="ts">
import CollapsedSidebar from './CollapsedSidebar.vue'
import ExpandedSidebar from './ExpandedSidebar.vue'
import { useShapesStore } from '@/stores/shapes/shapes'

defineProps<{
  isCollapsed: boolean
}>()

const shapesStore = useShapesStore()

const handleClearAll = () => {
  if (confirm('Are you sure you want to clear all shapes?')) {
    shapesStore.clearAll()
  }
}
</script>
