<template>
  <aside
    v-if="selectedElement"
    data-testid="right-sidebar"
    class="flex flex-col h-full border-l border-ma-grey-300 bg-ma-grey-100 transition-all duration-200 overflow-hidden"
    :class="isCollapsed ? 'w-0 p-0 border-0' : 'w-56'"
  >
    <div class="p-3 border-b border-ma-grey-300">
      <h2 class="font-semibold text-ma-text-01">Properties</h2>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <div class="flex flex-col gap-2">
        <SelectionInfoBanner />

        <!-- Shape Style Section -->
        <SidebarGroup v-if="hasShapeElements" :sidebar-collapsed="false">
          <template #title>
            <div class="flex items-center gap-1.5">
              <Palette class="w-3 h-3" />
              <span>Shape</span>
            </div>
          </template>
          <PropertyColorInput
            id="shape-outline"
            v-model="outlineColorValue"
            label="Outline"
            @change="updateOutline"
          />
          <PropertyNumericInput
            id="shape-stroke-width"
            v-model="strokeWeightValue"
            label="Stroke"
            @change="updateStrokeWeight"
          />
          <PropertyColorInput
            id="shape-fill"
            v-model="fillColorValue"
            label="Fill"
            @change="updateFill"
          />
        </SidebarGroup>

        <!-- Icon Style Section -->
        <SidebarGroup v-if="hasIconElements" :sidebar-collapsed="false">
          <template #title>
            <div class="flex items-center gap-1.5">
              <Sparkles class="w-3 h-3" />
              <span>Icon</span>
            </div>
          </template>
          <PropertyColorInput
            id="icon-color"
            v-model="iconColorValue"
            label="Color"
            @change="updateIconColor"
          />
          <PropertyNumericInput
            id="icon-stroke-width"
            v-model="iconStrokeWeightValue"
            label="Stroke"
            @change="updateIconStrokeWeight"
          />
        </SidebarGroup>

        <!-- Typography Section -->
        <SidebarGroup v-if="showTypographySection" :sidebar-collapsed="false">
          <template #title>
            <div class="flex items-center gap-1.5">
              <Type class="w-3 h-3" />
              <span>Text</span>
            </div>
          </template>
          <PropertyTextInput
            v-if="showTextContent"
            id="text-content"
            v-model="textContentValue"
            label="Content"
            @update:model-value="updateTextContent"
          />
          <div
            v-else-if="hasTextElements || hasShapeElements"
            class="text-xs text-ma-text-02 italic py-1"
          >
            Select single element to edit text
          </div>
          <PropertySelectInput
            id="font-family"
            v-model="fontFamilyValue"
            label="Font"
            :options="fontFamilyOptions"
          />
          <PropertyNumericInput
            id="font-size"
            v-model="fontSizeValue"
            label="Size"
            @change="updateFontSize"
          />
          <PropertyColorInput
            id="text-color"
            v-model="textColorValue"
            label="Color"
            @change="updateTextColor"
          />
        </SidebarGroup>

        <!-- Link Section - Single element only, at bottom -->
        <SidebarGroup
          v-if="showLinkSection"
          :sidebar-collapsed="false"
          :default-open="false"
        >
          <template #title>
            <div class="flex items-center gap-1.5">
              <LinkIcon class="w-3 h-3" />
              <span>Link</span>
            </div>
          </template>
          <PropertyLinkInput
            id="element-link"
            label="URL"
            :model-value="selectedElement.link"
            @save="updateLink"
            @remove="removeLink"
          />
        </SidebarGroup>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Palette, Sparkles, Type, Link as LinkIcon } from 'lucide-vue-next'
import { useElementsStore } from '@/stores/elements/elements'
import type { ShapeElement, IconElement } from '@/types/Element'
import type { GroupElement } from '@/types/GroupElement'
import PropertyColorInput from './components/PropertyColorInput.vue'
import PropertyNumericInput from './components/PropertyNumericInput.vue'
import PropertyLinkInput from './components/PropertyLinkInput.vue'
import PropertyTextInput from './components/PropertyTextInput.vue'
import PropertySelectInput from './components/PropertySelectInput.vue'
import SelectionInfoBanner from './components/SelectionInfoBanner.vue'
import SidebarGroup from '@/components/Sidebar/SidebarGroup.vue'
import {
  defaultFillColor,
  defaultOutlineColor,
  defaultTextColor,
} from '@/types/DefaultColors'

defineProps<{
  isCollapsed?: boolean
}>()

const elementsStore = useElementsStore()
const selectedElement = computed(() => elementsStore.selectedElement)

// Get all elements that can have properties changed (including group children)
const editableElements = computed(() => {
  const elements: typeof elementsStore.elements = []
  elementsStore.selectedElements.forEach((el) => {
    if (el.type === 'group') {
      const groupElement = el as GroupElement
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

// Selection state
const isSingleSelection = computed(
  () => elementsStore.selectedElements.length === 1
)
const isGroupSelected = computed(() => selectedElement.value?.type === 'group')

// Element type checks
const hasShapeElements = computed(() =>
  editableElements.value.some((el) => el.type === 'shape')
)
const hasTextElements = computed(() =>
  editableElements.value.some((el) => el.type === 'text')
)
const hasIconElements = computed(() =>
  editableElements.value.some((el) => el.type === 'icon')
)

// Section visibility - Link only for shapes
const showLinkSection = computed(
  () =>
    isSingleSelection.value &&
    !isGroupSelected.value &&
    selectedElement.value?.type === 'shape'
)
const showTypographySection = computed(
  () => hasShapeElements.value || hasTextElements.value
)
const showTextContent = computed(
  () =>
    isSingleSelection.value &&
    !isGroupSelected.value &&
    (selectedElement.value?.type === 'shape' ||
      selectedElement.value?.type === 'text')
)

// Local state
const outlineColorValue = ref(defaultOutlineColor)
const fillColorValue = ref(defaultFillColor)
const strokeWeightValue = ref(1)
const textContentValue = ref('')
const fontFamilyValue = ref('Arial')
const textColorValue = ref(defaultTextColor)
const fontSizeValue = ref(16)
const iconColorValue = ref(defaultOutlineColor)
const iconStrokeWeightValue = ref(2)

const fontFamilyOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Verdana', value: 'Verdana' },
]

// Sync local state when selected element changes
watch(
  selectedElement,
  (newElement) => {
    if (!newElement) return

    if (newElement.type === 'shape') {
      const shape = newElement as ShapeElement
      outlineColorValue.value = shape.outline || defaultOutlineColor
      fillColorValue.value = shape.fill || defaultFillColor
      strokeWeightValue.value = shape.strokeWeight || 0
      textContentValue.value = shape.content || ''
      fontFamilyValue.value = shape.fontFamily || 'Arial'
      textColorValue.value = shape.color || defaultTextColor
      fontSizeValue.value = shape.fontSize || 16
    } else if (newElement.type === 'text') {
      textContentValue.value = newElement.content
      fontFamilyValue.value = newElement.fontFamily
      textColorValue.value = newElement.color || defaultTextColor
      fontSizeValue.value = newElement.fontSize
    } else if (newElement.type === 'icon') {
      const icon = newElement as IconElement
      iconColorValue.value = icon.color || defaultOutlineColor
      iconStrokeWeightValue.value = icon.strokeWeight
    }
  },
  { immediate: true, deep: true }
)

// Broadcast helper
const broadcastUpdate = (
  filter: (el: (typeof editableElements.value)[0]) => boolean,
  update: Record<string, unknown>
) => {
  editableElements.value.filter(filter).forEach((el) => {
    elementsStore.updateElement(el.id, update)
  })
}

// Update functions
const updateOutline = (val: string) => {
  broadcastUpdate((el) => el.type === 'shape', { outline: val })
}

const updateFill = (val: string) => {
  broadcastUpdate((el) => el.type === 'shape', { fill: val })
}

const updateStrokeWeight = (val: number) => {
  broadcastUpdate((el) => el.type === 'shape', { strokeWeight: val })
  strokeWeightValue.value = val
}

const updateIconColor = (val: string) => {
  broadcastUpdate((el) => el.type === 'icon', { color: val })
}

const updateIconStrokeWeight = (val: number) => {
  broadcastUpdate((el) => el.type === 'icon', { strokeWeight: val })
  iconStrokeWeightValue.value = val
}

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

const updateTextContent = (val: string) => {
  if (selectedElement.value) {
    elementsStore.updateElement(selectedElement.value.id, { content: val })
  }
}

const updateTextColor = (val: string) => {
  broadcastUpdate((el) => el.type === 'text' || el.type === 'shape', {
    color: val,
  })
}

const updateFontSize = (val: number) => {
  broadcastUpdate((el) => el.type === 'text' || el.type === 'shape', {
    fontSize: val,
  })
  fontSizeValue.value = val
}

// Broadcast fontFamily changes
watch(fontFamilyValue, (val) => {
  broadcastUpdate((el) => el.type === 'text' || el.type === 'shape', {
    fontFamily: val,
  })
})
</script>
