<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        :class="[
          'gap-2 text-ma-text-01',
          collapsed
            ? 'w-10 h-10 p-0 justify-center'
            : 'w-full h-9 px-2 justify-start',
        ]"
        :title="category.label"
      >
        <component
          :is="category.icon"
          :style="{ color: defaultOutlineColor }"
          class="w-4 h-4 text-ma-text-01"
        />
        <span v-if="!collapsed" class="text-sm text-ma-text-01">{{
          category.label
        }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="p-0 shadow-xl border border-ma-grey-300 bg-ma-grey-100 rounded-xl overflow-hidden flex flex-col"
      align="start"
      side="right"
      :side-offset="10"
      :style="{ width: '220px' }"
    >
      <div
        class="flex items-center justify-between p-3 border-b border-ma-grey-300 bg-transparent"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="shadow-sm border border-ma-grey-300 bg-ma-grey-100 p-1 rounded-lg"
          >
            <component :is="category.icon" class="w-4 h-4 text-ma-text-02" />
          </div>
          <h3 class="text-sm font-semibold tracking-wide text-ma-text-01">
            {{ category.label }}
          </h3>
        </div>
      </div>

      <div
        class="p-2 grid grid-cols-5 gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar"
      >
        <Button
          v-for="(iconComponent, iconName) in category.icons"
          :key="iconName"
          variant="ghost"
          class="h-9 w-9 p-0 hover:bg-toolbar-btn-bg-hover transition-colors rounded-lg flex items-center justify-center"
          :title="iconName"
          @click="handleIconClick(iconName as string)"
        >
          <component
            :is="iconComponent"
            :style="{ color: defaultOutlineColor }"
            class="w-5 h-5"
          />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useElementsStore } from '@/stores/elements/elements'
import { useDragStore } from '@/stores/drag/dragGhost'
import { defaultOutlineColor } from '@/types/DefaultColors'
import type { ICON_CATEGORIES } from '@/components/Icons'

defineProps<{
  category: (typeof ICON_CATEGORIES)[keyof typeof ICON_CATEGORIES]
  collapsed?: boolean
}>()

const elementsStore = useElementsStore()
const dragStore = useDragStore()

const handleIconClick = (iconName: string) => {
  const center = dragStore.viewportCenter
  elementsStore.addIcon(iconName, center.x, center.y)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--ma-grey-400);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--ma-grey-500);
}
</style>
