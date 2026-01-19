<template>
  <div class="flex flex-col gap-2">
    <Label :for="id" class="text-xs font-medium text-ma-text-01">
      {{ label }}
    </Label>
    <div
      class="flex flex-col border border-ma-grey-300 rounded-md bg-ma-grey-200 overflow-hidden"
    >
      <textarea
        :id="id"
        class="flex-1 p-2 text-xs outline-none min-w-0 bg-ma-grey-200 text-ma-text-01 resize-y min-h-[60px]"
        :value="modelValue"
        @input="
          $emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value
          )
        "
      ></textarea>
    </div>
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
