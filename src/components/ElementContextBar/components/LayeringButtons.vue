<template>
  <Button
    data-testid="context-up-button"
    variant="ghost"
    size="icon-sm"
    title="Bring to front"
    @click="$emit('up')"
  >
    <ArrowUp class="w-4 h-4" />
  </Button>
  <Button
    data-testid="context-down-button"
    variant="ghost"
    size="icon-sm"
    title="Send to back"
    @click="$emit('down')"
  >
    <ArrowDown class="w-4 h-4" />
  </Button>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  up: []
  down: []
}>()
</script>
