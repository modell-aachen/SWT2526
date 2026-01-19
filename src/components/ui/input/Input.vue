<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'file:text-ma-text-01 placeholder:text-ma-text-03 selection:bg-ma-primary-300 selection:text-ma-text-01 border-ma-grey-400 bg-ma-grey-100 h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base text-ma-text-01 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ma-primary-500 focus-visible:ring-ma-primary-500/50 focus-visible:ring-[3px]',
        props.class
      )
    "
  />
</template>
