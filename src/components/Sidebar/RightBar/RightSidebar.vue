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
      <template v-if="hasShapeElements || selectedElement?.type === 'shape'">
        <PropertyLinkInput
          v-if="!isGroupSelected"
          id="shape-link"
          label="Link"
          :model-value="selectedElement.link"
          @save="updateLink"
          @remove="removeLink"
        />

        <PropertyColorInput
          id="shape-outline"
          v-model="outlineColorValue"
          label="Outline"
          @change="updateOutline"
        />

        <PropertyColorInput
          id="shape-fill"
          v-model="fillColorValue"
          label="Fill"
          @change="updateFill"
        />

        <PropertyNumericInput
          id="shape-stroke-width"
          v-model="strokeWeightValue"
          label="Stroke Width"
          @change="updateStrokeWeight"
        />

        <div
          v-if="!isGroupSelected"
          class="border-t border-ma-grey-300 my-2 pt-2"
        >
          <h3 class="text-sm font-semibold mb-2 text-ma-text-02">
            Text Overlay
          </h3>
          <PropertyTextInput
            id="shape-text-content"
            v-model="textContentValue"
            label="Text"
            @update:model-value="updateTextContent"
          />

          <PropertySelectInput
            id="shape-font-family"
            v-model="fontFamilyValue"
            label="Font Family"
            :options="fontFamilyOptions"
          />

          <PropertyNumericInput
            id="shape-font-size"
            v-model="fontSizeValue"
            label="Font Size"
            @change="updateFontSize"
          />

          <PropertyColorInput
            id="shape-text-color"
            v-model="textColorValue"
            label="Text Color"
            @change="updateTextColor"
          />
        </div>
      </template>

      <template
        v-if="
          !isGroupSelected &&
          (hasTextElements || selectedElement?.type === 'text')
        "
      >
        <PropertyTextInput
          id="text-content"
          v-model="textContentValue"
          label="Content"
          @update:model-value="updateTextContent"
        />

        <PropertySelectInput
          id="text-font-family"
          v-model="fontFamilyValue"
          label="Font Family"
          :options="fontFamilyOptions"
        />

        <PropertyNumericInput
          id="text-font-size"
          v-model="fontSizeValue"
          label="Font Size"
          @change="updateFontSize"
        />

        <PropertyColorInput
          id="text-color"
          v-model="textColorValue"
          label="Color"
          @change="updateTextColor"
        />
      </template>
      <template v-if="hasIconElements || selectedElement?.type === 'icon'">
        <PropertyColorInput
          id="icon-color"
          v-model="iconColorValue"
          label="Color"
          @change="updateIconColor"
        />

        <PropertyNumericInput
          id="icon-stroke-width"
          v-model="iconStrokeWeightValue"
          label="Stroke Width"
          @change="updateIconStrokeWeight"
        />
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeElement, IconElement } from '@/types/Element'
import PropertyColorInput from './components/PropertyColorInput.vue'
import PropertyNumericInput from './components/PropertyNumericInput.vue'
import PropertyLinkInput from './components/PropertyLinkInput.vue'
import PropertyTextInput from './components/PropertyTextInput.vue'
import PropertySelectInput from './components/PropertySelectInput.vue'

defineProps<{
  isCollapsed?: boolean
}>()
const elementsStore = useElementsStore()
const selectedElement = computed(() => elementsStore.selectedElement)
const isGroupSelected = computed(() => selectedElement.value?.type === 'group')

// Get all elements that can have properties changed (including group children)
const editableElements = computed(() => {
  const elements: typeof elementsStore.elements = []
  elementsStore.selectedElements.forEach((el) => {
    if (el.type === 'group') {
      // Include group children for property editing
      const groupElement = el as import('@/types/GroupElement').GroupElement
      groupElement.childIds.forEach((childId) => {
        const child = elementsStore.elements.find((e) => e.id === childId)
        if (child) elements.push(child)
      })
    } else {
      elements.push(el)
    }
  })
  return elements
})

// Check if any editable elements are shapes
const hasShapeElements = computed(() =>
  editableElements.value.some((el) => el.type === 'shape')
)

// Check if any editable elements are text
const hasTextElements = computed(() =>
  editableElements.value.some((el) => el.type === 'text')
)

// Check if any editable elements are icons
const hasIconElements = computed(() =>
  editableElements.value.some((el) => el.type === 'icon')
)

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
const iconColorValue = ref('#000000')
const iconStrokeWeightValue = ref(2)

const fontFamilyOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Verdana', value: 'Verdana' },
]

// Update local state when selected element changes
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
      // Unified text properties: content, color, fontFamily, fontSize
      textContentValue.value = shape.content || ''
      fontFamilyValue.value = shape.fontFamily || 'Arial'
      textColorValue.value = shape.color || '#000000'
      fontSizeValue.value = shape.fontSize || 16
    } else if (newElement && newElement.type === 'text') {
      // Same property names as shape: content, color, fontFamily, fontSize
      textContentValue.value = newElement.content
      fontFamilyValue.value = newElement.fontFamily
      textColorValue.value = newElement.color
      fontSizeValue.value = newElement.fontSize
    } else if (newElement && newElement.type === 'icon') {
      const icon = newElement as IconElement
      iconColorValue.value = icon.color
      iconStrokeWeightValue.value = icon.strokeWeight
    }
  },
  { immediate: true, deep: true }
)

const updateOutline = (val: string) => {
  // Apply to all editable shape elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'shape')
    .forEach((el) => elementsStore.updateElement(el.id, { outline: val }))
}

const updateFill = (val: string) => {
  // Apply to all editable shape elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'shape')
    .forEach((el) => elementsStore.updateElement(el.id, { fill: val }))
}

const updateStrokeWeight = (val: number) => {
  // Apply to all editable shape elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'shape')
    .forEach((el) => elementsStore.updateElement(el.id, { strokeWeight: val }))
  if (selectedElement.value && selectedElement.value.type === 'shape') {
    strokeWeightValue.value = (
      selectedElement.value as ShapeElement
    ).strokeWeight
  }
}

// Unified: broadcast fontFamily to all editable text/shape elements
watch(fontFamilyValue, (val) => {
  editableElements.value
    .filter((el) => el.type === 'text' || el.type === 'shape')
    .forEach((el) => elementsStore.updateElement(el.id, { fontFamily: val }))
})

const updateLink = (link: string | undefined) => {
  if (selectedElement.value) {
    elementsStore.updateElement(selectedElement.value.id, { link })
  }
}

const removeLink = () => {
  if (selectedElement.value) {
    elementsStore.updateElement(selectedElement.value.id, { link: undefined })
  }
}

// Unified: no if/else needed since both shape and text use content
const updateTextContent = (val: string) => {
  if (selectedElement.value) {
    elementsStore.updateElement(selectedElement.value.id, { content: val })
  }
}

// Unified: no if/else needed since both shape and text use color
const updateTextColor = (val: string) => {
  // Apply to all editable text/shape elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'text' || el.type === 'shape')
    .forEach((el) => elementsStore.updateElement(el.id, { color: val }))
}

// Unified: broadcast fontSize to all editable text/shape elements
const updateFontSize = (val: number) => {
  editableElements.value
    .filter((el) => el.type === 'text' || el.type === 'shape')
    .forEach((el) => elementsStore.updateElement(el.id, { fontSize: val }))
  fontSizeValue.value = val
}

const updateIconColor = (val: string) => {
  // Apply to all editable icon elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'icon')
    .forEach((el) => elementsStore.updateElement(el.id, { color: val }))
}

const updateIconStrokeWeight = (val: number) => {
  if (selectedElement.value && selectedElement.value.type === 'icon') {
    elementsStore.updateElement(selectedElement.value.id, { strokeWeight: val })
    iconStrokeWeightValue.value = val
  }
}
</script>
