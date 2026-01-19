<template>
  <Button
    variant="ghost"
    size="icon-sm"
    data-testid="sidebar-toggle"
    class="absolute top-3 z-10 bg-ma-grey-100 border border-ma-grey-300 shadow-sm"
    :class="side === 'left' ? 'left-3' : 'right-3'"
    :title="`Toggle ${side} sidebar`"
    @click="$emit('toggle')"
  >
    <template v-if="side === 'left'">
      <PanelLeftClose v-if="!isCollapsed" class="w-5 h-5 text-ma-text-01" />
      <PanelLeft v-else class="w-5 h-5 text-ma-text-01" />
    </template>
    <template v-else>
      <PanelRightClose v-if="!isCollapsed" class="w-5 h-5 text-ma-text-01" />
      <PanelRight v-else class="w-5 h-5 text-ma-text-01" />
    </template>
  </Button>
</template>

<script setup lang="ts">
import {
  PanelLeft,
  PanelLeftClose,
  PanelRight,
  PanelRightClose,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

withDefaults(
  defineProps<{
    isCollapsed: boolean
    side?: 'left' | 'right'
  }>(),
  {
    side: 'left',
  }
)

defineEmits<{
  toggle: []
}>()
</script>
