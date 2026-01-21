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
      <PropertyLinkInput
        id="shape-link"
        label="Link"
        :model-value="selectedElement.link"
        @save="updateLink"
        @remove="removeLink"
      />

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

      <template v-if="selectedElement?.type === 'text'">
        <PropertyTextInput
          id="text-content"
          label="Content"
          v-model="textContentValue"
          @update:modelValue="updateTextContent"
        />

        <PropertySelectInput
          id="text-font-family"
          label="Font Family"
          v-model="fontFamilyValue"
          :options="fontFamilyOptions"
        />

        <PropertyNumericInput
          id="text-font-size"
          label="Font Size"
          v-model="fontSizeValue"
          @change="updateFontSize"
        />

        <PropertyColorInput
          id="text-color"
          label="Color"
          v-model="textColorValue"
          @change="updateTextColor"
        />
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeElement, TextElement } from '@/types/Element'
import PropertyColorInput from './components/PropertyColorInput.vue'
import PropertyNumericInput from './components/PropertyNumericInput.vue'
import PropertyLinkInput from './components/PropertyLinkInput.vue'
import PropertyTextInput from './components/PropertyTextInput.vue'
import PropertySelectInput from './components/PropertySelectInput.vue'

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
const textContentValue = ref('')
const fontFamilyValue = ref('Arial')
const textColorValue = ref('#000000')
const fontSizeValue = ref(16)

const fontFamilyOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Verdana', value: 'Verdana' },
]

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
    } else if (newElement && newElement.type === 'text') {
      const text = newElement as TextElement
      textContentValue.value = text.content
      fontFamilyValue.value = text.fontFamily
      textColorValue.value = text.color
      fontSizeValue.value = text.fontSize
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
    strokeWeightValue.value = selectedElement.value.strokeWeight
  }
}

watch(fontFamilyValue, (val) => {
  if (selectedElement.value && selectedElement.value.type === 'text') {
    elementsStore.updateTextElement(selectedElement.value.id, {
      fontFamily: val,
    })
  }
})

const updateX = (val: number) => {
  if (selectedElement.value) {
    elementsStore.setElementPosition(
      selectedElement.value.id,
      val,
      selectedElement.value.y
    )
    xValue.value = selectedElement.value.x
  }
}

const updateY = (val: number) => {
  if (selectedElement.value) {
    elementsStore.setElementPosition(
      selectedElement.value.id,
      selectedElement.value.x,
      val
    )
    yValue.value = selectedElement.value.y
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

const updateTextContent = (val: string) => {
  if (selectedElement.value && selectedElement.value.type === 'text') {
    elementsStore.updateTextElement(selectedElement.value.id, { content: val })
  }
}

const updateTextColor = (val: string) => {
  if (selectedElement.value && selectedElement.value.type === 'text') {
    elementsStore.updateTextElement(selectedElement.value.id, { color: val })
  }
}

const updateFontSize = (val: number) => {
  if (selectedElement.value && selectedElement.value.type === 'text') {
    elementsStore.updateTextElement(selectedElement.value.id, { fontSize: val })
    fontSizeValue.value = selectedElement.value.fontSize
  }
}
</script>
