<template>
  <div
    class="w-full h-full flex items-center justify-center p-2 overflow-hidden text-center"
    :style="{
      color: color,
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
    }"
  >
    <span
      v-if="isEditing"
      ref="editableRef"
      contenteditable="true"
      class="outline-none min-w-[1ch]"
      @blur="finishEditing"
      @keydown="handleKeyDown"
      @mousedown.stop
      @input="handleInput"
    ></span>
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

const editableRef = ref<HTMLSpanElement | null>(null)
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
      if (editableRef.value) {
        // initialize editable element content directly to avoid Vue
        // re-rendering the inner text on each keystroke (which resets
        // the caret to the start). Manage the DOM textContent manually
        // while editing.
        editableRef.value.textContent = editValue.value
        editableRef.value.focus()
        // Select all text
        const range = document.createRange()
        range.selectNodeContents(editableRef.value)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }
)

const handleInput = (e: Event) => {
  const target = e.target as HTMLSpanElement
  editValue.value = target.textContent || ''
}

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
  if (editableRef.value) {
    editableRef.value.textContent = props.content
  }
  emit('finish-editing')
}
</script>
