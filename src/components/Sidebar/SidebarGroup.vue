<template>
  <div class="mb-2" data-testid="sidebar-group">
    <!-- Group header - clickable to collapse -->
    <button
      v-if="!sidebarCollapsed"
      data-testid="sidebar-group-toggle"
      class="flex items-center justify-between w-full py-1 text-xs text-ma-text-02 hover:text-ma-text-01 transition-colors"
      @click="isOpen = !isOpen"
    >
      <span>{{ title }}</span>
      <ChevronDown
        class="w-3 h-3 transition-transform"
        :class="{ 'rotate-180': !isOpen }"
      />
    </button>

    <!-- Group content -->
    <div v-show="isOpen || sidebarCollapsed" class="flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title: string
    sidebarCollapsed: boolean
    defaultOpen?: boolean
  }>(),
  {
    defaultOpen: true,
  }
)

const isOpen = ref(props.defaultOpen)
</script>
