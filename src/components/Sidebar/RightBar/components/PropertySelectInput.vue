<template>
  <div class="flex flex-col gap-2">
    <Label :for="id" class="text-xs font-medium text-ma-text-01">
      {{ label }}
    </Label>
    <div
      class="flex items-center border border-ma-grey-300 rounded-md bg-ma-grey-200 overflow-hidden h-8"
    >
      <select
        :id="id"
        class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-ma-grey-200 text-ma-text-01 appearance-none cursor-pointer"
        :value="modelValue"
        @change="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="px-2 pointer-events-none text-ma-text-02">
        <ChevronDown class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  modelValue: string
  label: string
  id: string
  options: { label: string; value: string }[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
