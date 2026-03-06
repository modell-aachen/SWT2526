<template>
  <div
    data-testid="view-page-container"
    class="flex h-screen w-screen overflow-hidden bg-bg-maincontent"
  >
    <div class="flex flex-col flex-1 relative">
      <GridCanvas ref="canvasRef">
        <ElementWrapperReadOnly
          v-for="element in elementsStore.sortedElements"
          :key="element.id"
          :element="element"
        />
      </GridCanvas>

      <!-- Floating zoom controls: bottom-right -->
      <FloatingZoomControls :right-sidebar-collapsed="true" view-mode />

      <!-- Upload button: bottom-left -->
      <div
        data-testid="view-toolbar"
        class="absolute bottom-[50px] left-[50px] z-50 flex items-center gap-2 bg-ma-grey-100 border border-ma-grey-300 rounded-lg shadow-md p-2"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="edit-button"
          title="Edit Canvas"
          @click="router.push('/edit')"
        >
          <Edit3 class="w-4 h-4 text-ma-text-01" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="load-button"
          title="Load JSON"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Edit3 } from 'lucide-vue-next'
import { useElementsStore } from '@/stores/elements/elements'
import { useCanvasIO } from '@/composables/useCanvasIO'
import { useDarkMode } from '@/composables/useDarkMode'
import GridCanvas from '@/components/GridCanvas/GridCanvas.vue'
import ElementWrapperReadOnly from '@/components/ElementWrapperReadOnly/ElementWrapperReadOnly.vue'
import FloatingZoomControls from '@/components/FloatingZoomControls/FloatingZoomControls.vue'
import { Button } from '@/components/ui/button'

const elementsStore = useElementsStore()
const { loadFromFile } = useCanvasIO()
const router = useRouter()
// Initializing useDarkMode will ensure the persistent dark state applies here too
useDarkMode()

const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  elementsStore.clearSelection()
})

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
