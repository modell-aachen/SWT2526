<template>
  <Button
    data-testid="context-delete-button"
    variant="destructive"
    size="icon-sm"
    title="Delete"
    @click="$emit('delete')"
  >
    <Trash2 class="w-4 h-4" />
  </Button>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineEmits<{
  delete: []
}>()
</script>
