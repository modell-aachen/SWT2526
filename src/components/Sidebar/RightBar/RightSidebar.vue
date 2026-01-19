<template>
  <aside
    v-if="selectedElement"
    data-testid="right-sidebar"
    class="flex flex-col h-full border-l border-ma-grey-300 bg-ma-grey-100 transition-all duration-200 overflow-hidden"
    :class="isCollapsed ? 'w-0 p-0 border-0' : 'w-64'"
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
        
        
        <PropertyLinkInput
        id="shape-link"
        label="Link"
        :model-value="selectedElement.link"
        @save="updateLink"
        @remove="removeLink"
        />
      </template>
      
      <PropertyNumericInput
        id="element-x"
        label="X-Coordinate"
        v-model="xValue"
        @change="updateX"
        class="flex-1"
      />
      <PropertyNumericInput
        id="element-y"
        label="Y-Coordinate"
        v-model="yValue"
        @change="updateY"
        class="flex-1"
      />

    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeElement } from '@/types/Element'
import PropertyColorInput from './components/PropertyColorInput.vue'
import PropertyNumericInput from './components/PropertyNumericInput.vue'
import PropertyLinkInput from './components/PropertyLinkInput.vue'

const elementsStore = useElementsStore()
const selectedElement = computed(() => elementsStore.selectedElement)

defineProps<{
  isCollapsed?: boolean
}>()

// Local state
const outlineColorValue = ref('#000000')
const fillColorValue = ref('#transparent')
const strokeWeightValue = ref(1)
const xValue = ref(0)
const yValue = ref(0)

// Update local state when selected shape changes
watch(
  selectedElement,
  (newElement) => {
    if (newElement) {
        xValue.value = newElement.x
        yValue.value = newElement.y
    }
    if (newElement && newElement.type === 'shape') {
      const shape = newElement as ShapeElement
      outlineColorValue.value = shape.outline || '#000000'
      fillColorValue.value = shape.fill || 'transparent'
      strokeWeightValue.value = shape.strokeWeight || 0
    }
  },
  { immediate: true, deep: true }
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

const updateX = (val: number) => {
  if (selectedElement.value) {
    elementsStore.setElementPosition(selectedElement.value.id, val, selectedElement.value.y)
  }
}

const updateY = (val: number) => {
  if (selectedElement.value) {
    elementsStore.setElementPosition(selectedElement.value.id, selectedElement.value.x, val)
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
