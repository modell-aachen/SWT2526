<template>
  <div class="flex flex-col gap-2">
    <Label :for="id" class="text-xs font-medium text-ma-text-01">
      {{ label }}
    </Label>
    <div
      class="flex gap-2 items-center border border-ma-grey-500 rounded-md bg-ma-grey-200 overflow-hidden h-8"
    >
      <div
        class="flex flex-1 items-center border border-ma-grey-300 rounded-md bg-ma-grey-200 overflow-hidden h-8"
      >
        <input
          :id="id"
          type="number"
          class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-ma-grey-200 text-ma-text-01 placeholder:text-muted-foreground"
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
