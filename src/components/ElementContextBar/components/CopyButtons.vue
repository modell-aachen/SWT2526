<template>
  <Button
    data-testid="context-copy-button"
    variant="ghost"
    size="icon-sm"
    title="Copy"
    @click="$emit('copy')"
  >
    <Copy class="w-4 h-4" />
  </Button>
  <Button
    data-testid="context-duplicate-button"
    variant="ghost"
    size="icon-sm"
    title="Duplicate"
    @click="$emit('duplicate')"
  >
    <CopyPlus class="w-4 h-4" />
  </Button>
</template>

<script setup lang="ts">
import { Copy, CopyPlus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  copy: []
  duplicate: []
}>()
</script>
