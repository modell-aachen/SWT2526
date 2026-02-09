<template>
  <div class="flex flex-col gap-2">
    <Label :for="id" class="text-xs font-medium text-ma-text-01">
      {{ label }}
    </Label>
    <div
      class="flex gap-2 items-center border border-ma-grey-500 rounded-md bg-ma-grey-200 overflow-hidden"
    >
      <div
        class="flex flex-1 items-center h-8 border border-ma-grey-300 rounded-md bg-ma-grey-200 overflow-hidden"
      >
        <input
          type="color"
          class="w-8 h-full border-none p-0 cursor-pointer"
          :value="modelValue"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
          @change="$emit('change', ($event.target as HTMLInputElement).value)"
        />
        <input
          :id="id"
          :value="modelValue"
          class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-transparent text-ma-text-01 placeholder:text-muted-foreground uppercase"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
          @change="$emit('change', ($event.target as HTMLInputElement).value)"
        />
      </div>
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
