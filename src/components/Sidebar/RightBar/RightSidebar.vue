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
      </template>

      <template v-if="hasTextElements || selectedElement?.type === 'text'">
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

      <PropertyNumericInput
        id="element-x"
        v-model="xValue"
        label="X-Coordinate"
        class="flex-1"
        @change="updateX"
      />
      <PropertyNumericInput
        id="element-y"
        v-model="yValue"
        label="Y-Coordinate"
        class="flex-1"
        @change="updateY"
      />
    </div>
    <div class="flex-1"></div>
    <div class="p-4 border-t border-ma-grey-300 flex gap-2">
      <Button
        variant="outline"
        class="flex-1 gap-2"
        data-testid="save-button"
        title="Save to JSON"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        <span>Save</span>
      </Button>
      <Button
        variant="outline"
        class="flex-1 gap-2"
        data-testid="upload-button"
        title="Upload JSON"
        @click="handleUploadClick"
      >
        <Upload class="w-4 h-4" />
        <span>Load</span>
      </Button>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleFileChange"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Save, Upload } from 'lucide-vue-next'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeElement, TextElement } from '@/types/Element'
import PropertyColorInput from './components/PropertyColorInput.vue'
import PropertyNumericInput from './components/PropertyNumericInput.vue'
import PropertyLinkInput from './components/PropertyLinkInput.vue'
import PropertyTextInput from './components/PropertyTextInput.vue'
import PropertySelectInput from './components/PropertySelectInput.vue'
import type { IconElement } from '@/types/Element'
import { Button } from '@/components/ui/button'
import { useCanvasIO } from '@/composables/useCanvasIO'

defineProps<{
  isCollapsed?: boolean
}>()
const elementsStore = useElementsStore()
const selectedElement = computed(() => elementsStore.selectedElement)
const selectedElements = computed(() => elementsStore.selectedElements)
const { saveToFile, loadFromFile } = useCanvasIO()

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
    .forEach((el) => elementsStore.updateShapeOutlineColor(el.id, val))
}

const updateFill = (val: string) => {
  // Apply to all editable shape elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'shape')
    .forEach((el) => elementsStore.updateShapeFillColor(el.id, val))
}

const updateStrokeWeight = (val: number) => {
  // Apply to all editable shape elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'shape')
    .forEach((el) => elementsStore.updateShapeStrokeWeight(el.id, val))
  if (selectedElement.value && selectedElement.value.type === 'shape') {
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
  // Apply to all editable text elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'text')
    .forEach((el) => elementsStore.updateTextElement(el.id, { color: val }))
}

const updateFontSize = (val: number) => {
  if (selectedElement.value && selectedElement.value.type === 'text') {
    elementsStore.updateTextElement(selectedElement.value.id, { fontSize: val })
    fontSizeValue.value = selectedElement.value.fontSize
  }
}

const updateIconColor = (val: string) => {
  // Apply to all editable icon elements (including group children)
  editableElements.value
    .filter((el) => el.type === 'icon')
    .forEach((el) => elementsStore.updateIconColor(el.id, val))
}

const updateIconStrokeWeight = (val: number) => {
  if (selectedElement.value && selectedElement.value.type === 'icon') {
    elementsStore.updateIconStrokeWeight(selectedElement.value.id, val)
    iconStrokeWeightValue.value = selectedElement.value.strokeWeight
  }
}

const fileInputRef = ref<HTMLInputElement | null>(null)

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
