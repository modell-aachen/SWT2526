<template>
  <aside
    v-if="selectedShape"
    data-testid="right-sidebar"
    class="flex flex-col h-full w-64 border-l border-ma-grey-300 bg-ma-grey-100 transition-all duration-200"
  >
    <div class="p-4 border-b border-ma-grey-300">
      <h2 class="font-semibold text-ma-text-01">Properties</h2>
    </div>

    <div class="p-4 flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <Label for="shape-link" class="text-xs font-medium text-ma-text-01">
          Link
        </Label>
        <div class="flex gap-2 items-center">
          <div
            class="flex flex-1 items-center border border-ma-grey-300 rounded-md bg-white overflow-hidden h-8 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          >
            <div
              class="bg-ma-grey-300 px-2 flex items-center h-full text-xs text-ma-text-02 font-medium border-r border-ma-grey-300 select-none"
            >
              https://
            </div>
            <input
              id="shape-link"
              v-model="linkInputValue"
              class="flex-1 h-full px-2 text-xs outline-none min-w-0 bg-ma-grey-100 text-ma-text-01 placeholder:text-muted-foreground"
              placeholder="example.com"
              @keyup.enter="updateLink"
            />
          </div>
        </div>
        <div class="flex flex-row gap-1 mt-2">
          <Button
            size="icon-sm"
            class="h-8 w-8 shrink-0 bg-ma-grey-800"
            title="Save link"
            @click="updateLink"
          >
            <Check class="w-4 h-4 text-ma-white-01" />
          </Button>

          <Button
            size="icon-sm"
            class="h-8 w-8 shrink-0 bg-ma-grey-800"
            title="Remove link"
            @click="removeLink"
          >
            <X class="w-4 h-4 text-ma-white-01" />
          </Button>
        </div>

        <p
          v-if="feedbackMessage == 'Link saved!'"
          class="text-[10px] text-green-600 font-medium"
        >
          {{ feedbackMessage }}
        </p>
        <p
          v-else-if="feedbackMessage == 'Link removed!'"
          class="text-[10px] text-red-600 font-medium"
        >
          {{ feedbackMessage }}
        </p>
        <p v-else class="text-[10px] text-ma-text-02">
          Enter a URL and click the check to save. Click the X to remove the
          link from element.
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useShapesStore } from '@/stores/shapes/shapes'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-vue-next'
import { X } from 'lucide-vue-next'

const shapesStore = useShapesStore()
const selectedShape = computed(() => shapesStore.selectedShape)

// Local state for the input field (without https:// prefix)
const linkInputValue = ref('')
const feedbackMessage = ref('')

// Update local state when selected shape changes
watch(
  selectedShape,
  (newShape) => {
    if (newShape) {
      if (newShape.link) {
        // Strip https:// or http:// for display
        linkInputValue.value = newShape.link.replace(/^https?:\/\//, '')
      } else {
        linkInputValue.value = ''
      }
    } else {
      linkInputValue.value = ''
    }
    feedbackMessage.value = ''
  },
  { immediate: true }
)

const updateLink = () => {
  if (selectedShape.value) {
    let rawVal = linkInputValue.value.trim()

    // Strip existing protocol if user typed it
    rawVal = rawVal.replace(/^https?:\/\//, '')

    // Construct full URL with https:// prefix if value exists
    let finalLink: string | undefined = undefined
    if (rawVal.length > 0) {
      finalLink = `https://${rawVal}`
    }

    shapesStore.updateShapeLink(selectedShape.value.id, finalLink)

    // Show feedback
    feedbackMessage.value = 'Link saved!'
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 2000)
  }
}

const removeLink = () => {
  shapesStore.removeShapeLink(selectedShape.value!.id)
  feedbackMessage.value = 'Link removed!'
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 2000)
}
</script>
