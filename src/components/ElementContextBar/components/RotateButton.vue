<template>
  <Button
    data-testid="context-rotate-button"
    variant="ghost"
    size="icon-sm"
    title="Rotate 90°"
    @click="$emit('rotate')"
  >
    <RotateCw class="w-4 h-4" />
  </Button>
</template>

<script setup lang="ts">
import { RotateCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  rotate: []
}>()
</script>
