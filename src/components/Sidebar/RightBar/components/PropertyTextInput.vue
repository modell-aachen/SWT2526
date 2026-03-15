<template>
  <div class="flex flex-col gap-1 py-1">
    <Label :for="id" class="text-xs text-ma-text-02">
      {{ label }}
    </Label>
    <textarea
      :id="id"
      class="w-full p-2 text-xs outline-none bg-ma-grey-200 text-ma-text-01 resize-y min-h-[48px] border border-ma-grey-300 rounded"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

defineProps<{
  modelValue: string
  label: string
  id: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
