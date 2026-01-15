<template>
  <div class="flex flex-col gap-2">
    <Label :for="id" class="text-xs font-medium text-ma-text-01">
      {{ label }}
    </Label>
    <div
      class="flex gap-2 items-center border border-ma-grey-500 rounded-md bg-ma-grey-200 overflow-hidden h-8"
    >
      <div
        class="flex flex-1 items-center border border-ma-grey-300 rounded-md bg-[--ma-grey-200] overflow-hidden h-8"
      >
        <div
          class="bg-ma-grey-300 px-2 flex items-center h-full text-xs text-ma-text-02 font-medium border-r border-ma-grey-300 select-none"
        >
          https://
        </div>
        <input
          :id="id"
          :value="internalValue"
          class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-transparent text-ma-text-01 placeholder:text-muted-foreground"
          placeholder="example.com"
          @input="
            updateInternalValue(($event.target as HTMLInputElement).value)
          "
          @keyup.enter="saveLink"
        />
      </div>
    </div>
    <div class="flex flex-row gap-1 mt-2">
      <Button
        size="icon-sm"
        class="h-8 w-8 shrink-0 bg-ma-grey-700 hover:bg-ma-grey-500"
        title="Save link"
        @click="saveLink"
      >
        <Check class="w-4 h-4 text-ma-white-01" />
      </Button>

      <Button
        size="icon-sm"
        class="h-8 w-8 shrink-0 bg-ma-grey-700 hover:bg-ma-grey-500"
        title="Remove link"
        @click="removeLink"
      >
        <X class="w-4 h-4 text-ma-white-01" />
      </Button>
    </div>

    <p
      v-if="feedbackMessage === 'Link saved!'"
      class="text-[10px] text-green-600 font-medium"
    >
      {{ feedbackMessage }}
    </p>
    <p
      v-else-if="feedbackMessage === 'Link removed!'"
      class="text-[10px] text-red-600 font-medium"
    >
      {{ feedbackMessage }}
    </p>
    <p v-else class="text-[10px] text-ma-text-02">
      Enter a URL and click the check to save. Click the X to remove the link
      from element.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string
  label: string
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
  (e: 'save', value: string | undefined): void
  (e: 'remove'): void
}>()

const internalValue = ref('')
const feedbackMessage = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      internalValue.value = newValue.replace(/^https?:\/\//, '')
    } else {
      internalValue.value = ''
    }
    feedbackMessage.value = ''
  },
  { immediate: true }
)

const updateInternalValue = (val: string) => {
  internalValue.value = val
  // We do NOT emit update:modelValue here because we want manual save only
}

const saveLink = () => {
  let rawVal = internalValue.value.trim()
  rawVal = rawVal.replace(/^https?:\/\//, '')

  let finalLink: string | undefined = undefined
  if (rawVal.length > 0) {
    finalLink = `https://${rawVal}`
  }

  emit('save', finalLink)
  feedbackMessage.value = 'Link saved!'
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 2000)
}

const removeLink = () => {
  emit('remove')
  feedbackMessage.value = 'Link removed!'
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 2000)
}
</script>
