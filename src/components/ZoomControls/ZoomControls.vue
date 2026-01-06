<template>
  <div
    data-testid="zoom-controls"
    class="absolute bottom-4 right-4 flex gap-1 bg-ma-grey-100 border border-ma-grey-300 rounded-lg p-1 shadow-sm"
  >
    <Button
      variant="ghost"
      size="icon-sm"
      data-testid="zoom-out-button"
      title="Zoom out (coming soon)"
    >
      <Minus class="w-4 h-4 text-ma-text-01" />
    </Button>
    <span
      class="flex items-center px-2 text-sm text-ma-text-01 min-w-[3rem] justify-center"
    >
      100%
    </span>
    <Button
      variant="ghost"
      size="icon-sm"
      data-testid="zoom-in-button"
      title="Zoom in (coming soon)"
    >
      <Plus class="w-4 h-4 text-ma-text-01" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Plus, Minus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>
