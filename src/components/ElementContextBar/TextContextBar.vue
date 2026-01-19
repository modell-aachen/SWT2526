<template>
  <div
    data-testid="text-context-bar"
    class="flex gap-1 p-1 bg-ma-grey-200 border border-ma-grey-300 rounded-lg shadow-lg items-center"
    @mousedown.stop
  >
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
    <div class="w-px h-4 bg-ma-grey-400 mx-0.5"></div>
    <Button
      data-testid="context-rotate-button"
      variant="ghost"
      size="icon-sm"
      title="Rotate 90°"
      @click="$emit('rotate')"
    >
      <RotateCw class="w-4 h-4" />
    </Button>
    <div class="w-px h-4 bg-ma-grey-400 mx-0.5"></div>
    <Button
      data-testid="context-delete-button"
      variant="destructive"
      size="icon-sm"
      title="Delete"
      @click="$emit('delete')"
    >
      <Trash2 class="w-4 h-4" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Copy, CopyPlus, RotateCw, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  copy: []
  duplicate: []
  rotate: []
  delete: []
}>()
</script>
