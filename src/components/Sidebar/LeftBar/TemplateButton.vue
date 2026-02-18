<template>
  <Button
    variant="ghost"
    :class="
      collapsed
        ? 'w-full justify-center h-10'
        : 'w-full justify-start gap-2 h-9 px-2 text-ma-text-01'
    "
    :title="name"
    :data-testid="`template-button-${name}`"
    @click="handleClick"
  >
    <LayoutTemplate class="w-4 h-4 text-ma-text-01 shrink-0" />
    <span v-if="!collapsed" class="text-sm text-ma-text-01 truncate">{{
      name
    }}</span>
  </Button>
</template>

<script setup lang="ts">
import { LayoutTemplate } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useElementsStore } from '@/stores/elements/elements'
import type { Template } from '@/templates'

const props = defineProps<{
  template: Template
  collapsed?: boolean
}>()

// Expose name as a convenience computed for the template
const name = props.template.name

const elementsStore = useElementsStore()

const handleClick = () => {
  const confirmed = window.confirm(
    `Load template "${props.template.name}"? This will replace the current canvas.`
  )
  if (confirmed) {
    elementsStore.importSnapshot(props.template.snapshot)
  }
}
</script>
