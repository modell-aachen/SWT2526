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
import { useElementsStore } from '@/stores/elements/elements'

defineProps<{
  isCollapsed: boolean
}>()

const elementsStore = useElementsStore()

const handleClearAll = () => {
  if (confirm('Are you sure you want to clear all shapes?')) {
    elementsStore.clearAll()
  }
}
</script>
