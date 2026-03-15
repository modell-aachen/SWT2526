<template>
  <div class="flex items-center gap-2 py-1">
    <Label :for="id" class="text-xs text-ma-text-02 w-14 shrink-0">
      {{ label }}
    </Label>
    <div
      class="flex flex-1 items-center h-7 border border-ma-grey-300 rounded bg-ma-grey-200 overflow-hidden"
    >
      <input
        :id="id"
        type="number"
        class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-ma-grey-200 text-ma-text-01"
        :value="modelValue"
        min="0"
        @input="
          $emit(
            'update:modelValue',
            Number(($event.target as HTMLInputElement).value)
          )
        "
        @change="
          $emit('change', Number(($event.target as HTMLInputElement).value))
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

defineProps<{
  modelValue: number
  label: string
  id: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()
</script>
