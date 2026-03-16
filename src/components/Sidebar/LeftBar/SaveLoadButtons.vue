<template>
  <div :class="containerClass">
    <div v-if="collapsed" class="w-full h-px bg-ma-grey-300 my-1" />
    <Button
      variant="ghost"
      :class="buttonClass"
      data-testid="save-button"
      title="Save to JSON"
      @click="handleSave"
    >
      <Save class="w-4 h-4 text-ma-text-01" />
    </Button>
    <Button
      variant="ghost"
      :class="buttonClass"
      data-testid="load-button"
      title="Upload JSON"
      @click="handleUploadClick"
    >
      <Upload class="w-4 h-4 text-ma-text-01" />
    </Button>
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Save, Upload } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useCanvasIO } from '@/composables/useCanvasIO'
import { useElementsStore } from '@/stores/elements/elements'

const props = defineProps<{
  collapsed?: boolean
}>()

const elementsStore = useElementsStore()
const { saveToFile, loadFromFile } = useCanvasIO()

const fileInputRef = ref<HTMLInputElement | null>(null)

const containerClass = computed(() =>
  props.collapsed
    ? 'p-1 flex flex-col gap-1 items-center'
    : 'p-2 border-t border-ma-grey-300 flex gap-2 justify-between'
)

const buttonClass = computed(() =>
  props.collapsed
    ? 'w-full h-10 gap-0 text-ma-text-01 hover:bg-ma-grey-200 justify-center'
    : 'flex-1 h-9 justify-center text-ma-text-01 hover:bg-ma-grey-200'
)

const handleSave = () => {
  saveToFile(elementsStore.exportSnapshot())
}

const handleUploadClick = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      try {
        const data = await loadFromFile(file)
        elementsStore.importSnapshot(data)
      } catch (error) {
        console.error('Failed to load file:', error)
        alert('Failed to load file. Please ensure it is a valid JSON file.')
      } finally {
        target.value = ''
      }
    }
  }
}
</script>
