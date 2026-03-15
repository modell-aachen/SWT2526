<template>
  <div class="flex items-center gap-1.5 py-1 pl-2">
    <Label :for="id" class="text-xs text-ma-text-02 w-12 shrink-0">
      {{ label }}
    </Label>
    <div
      class="flex flex-1 items-center h-7 border border-ma-grey-300 rounded bg-ma-grey-200 overflow-hidden"
    >
      <input
        type="color"
        class="w-7 h-full border-none p-0 cursor-pointer"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @change="$emit('change', ($event.target as HTMLInputElement).value)"
      />
      <input
        :id="id"
        :value="modelValue"
        class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-transparent text-ma-text-01 uppercase"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @change="$emit('change', ($event.target as HTMLInputElement).value)"
      />
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
  (e: 'change', value: string): void
}>()
</script>
