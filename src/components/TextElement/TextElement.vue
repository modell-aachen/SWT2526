<template>
  <div
    class="w-full h-full flex items-center justify-center p-2 overflow-hidden"
    :style="{
      color: color,
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
    }"
  >
    <textarea
      v-if="isEditing"
      ref="textareaRef"
      v-model="editValue"
      class="w-full h-full bg-transparent border-none outline-none resize-none text-center"
      :style="{
        color: color,
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
      }"
      @blur="finishEditing"
      @keydown="handleKeyDown"
      @mousedown.stop
    />
    <span v-else>{{ content }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  content: string
  color: string
  fontSize: number
  fontFamily: string
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:content', value: string): void
  (e: 'finish-editing'): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const editValue = ref(props.content)

watch(
  () => props.content,
  (newContent) => {
    editValue.value = newContent
  }
)

watch(
  () => props.isEditing,
  async (editing) => {
    if (editing) {
      editValue.value = props.content
      await nextTick()
      textareaRef.value?.focus()
      textareaRef.value?.select()
    }
  }
)

const handleKeyDown = (e: KeyboardEvent) => {
  // Stop all events from bubbling to canvas to prevent shortcuts
  e.stopPropagation()

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    finishEditing()
  } else if (e.key === 'Escape') {
    cancelEditing()
  }
}

const finishEditing = () => {
  if (editValue.value !== props.content) {
    emit('update:content', editValue.value)
  }
  emit('finish-editing')
}

const cancelEditing = () => {
  editValue.value = props.content
  emit('finish-editing')
}
</script>
