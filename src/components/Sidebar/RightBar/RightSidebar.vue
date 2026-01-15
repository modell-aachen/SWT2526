<template>
  <aside
    v-if="selectedElement"
    data-testid="right-sidebar"
    class="flex flex-col h-full w-64 border-l border-ma-grey-300 bg-ma-grey-100 transition-all duration-200"
  >
    <div class="p-4 border-b border-ma-grey-300">
      <h2 class="font-semibold text-ma-text-01">Properties</h2>
    </div>

    <div class="p-4 flex flex-col gap-4">
      <template v-if="selectedElement?.type === 'shape'">
        <PropertyColorInput
          id="shape-outline"
          label="Outline"
          v-model="outlineColorValue"
          @change="updateOutline"
        />

        <PropertyColorInput
          id="shape-fill"
          label="Fill"
          v-model="fillColorValue"
          @change="updateFill"
        />

        <PropertyNumericInput
          id="shape-stroke-width"
          label="Stroke Width"
          v-model="strokeWeightValue"
          @change="updateStrokeWeight"
        />
      </template>

      <PropertyLinkInput
        id="shape-link"
        label="Link"
        :model-value="(selectedElement as any).link"
        @save="updateLink"
        @remove="removeLink"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import PropertyColorInput from './components/PropertyColorInput.vue'
import PropertyNumericInput from './components/PropertyNumericInput.vue'
import PropertyLinkInput from './components/PropertyLinkInput.vue'

const elementsStore = useElementsStore()
const selectedElement = computed(() => elementsStore.selectedElement)

// Local state
const outlineColorValue = ref('#000000')
const fillColorValue = ref('#transparent')
const strokeWeightValue = ref(1)

// Update local state when selected shape changes
watch(
  selectedElement,
  (newElement) => {
    if (newElement && newElement.type === 'shape') {
      // Update colors
      if ('outline' in newElement) {
        outlineColorValue.value = (newElement as any).outline || '#000000'
      }
      if ('fill' in newElement) {
        fillColorValue.value = (newElement as any).fill || 'transparent'
      }
      if ('strokeWeight' in newElement) {
        strokeWeightValue.value = (newElement as any).strokeWeight || 1
      }
    }
  },
  { immediate: true }
)

const updateOutline = (val: string) => {
  if (selectedElement.value && selectedElement.value.type === 'shape') {
    elementsStore.updateShapeOutlineColor(selectedElement.value.id, val)
  }
}

const updateFill = (val: string) => {
  if (selectedElement.value && selectedElement.value.type === 'shape') {
    elementsStore.updateShapeFillColor(selectedElement.value.id, val)
  }
}

const updateStrokeWeight = (val: number) => {
  if (selectedElement.value && selectedElement.value.type === 'shape') {
    elementsStore.updateShapeStrokeWeight(selectedElement.value.id, val)
  }
}

const updateLink = (link: string | undefined) => {
  if (selectedElement.value) {
    elementsStore.updateElementLink(selectedElement.value.id, link)
  }
}

const removeLink = () => {
  if (selectedElement.value) {
    elementsStore.removeElementLink(selectedElement.value.id)
  }
}
</script>
