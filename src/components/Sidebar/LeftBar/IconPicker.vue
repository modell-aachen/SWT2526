<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        :class="[
          'gap-2 text-ma-text-01',
          collapsed
            ? 'w-10 h-10 p-0 ml-1 justify-center'
            : 'w-full h-9 px-2 justify-start',
        ]"
        title="Icons"
      >
        <Smile
          :style="{ color: defaultOutlineColor }"
          :class="['text-ma-text-01', collapsed ? 'w-4 h-4' : 'w-4 h-4']"
        />
        <span v-if="!collapsed" class="text-sm text-ma-text-01">Icons</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="p-0 shadow-xl border border-ma-grey-300 bg-ma-grey-100 rounded-xl overflow-hidden flex flex-col"
      align="start"
      side="right"
      :side-offset="10"
      :style="{ width: '270px' }"
    >
      <div
        class="flex items-center justify-between p-3 border-b border-ma-grey-300 bg-transparent"
      >
        <div class="flex items-center gap-2.5">
          <div class="shadow-sm border border-ma-grey-300 bg-ma-grey-100 p-1 rounded-lg">
            <Smile class="w-4 h-4 text-ma-text-02" />
          </div>
          <h3 class="text-sm font-semibold tracking-wide text-ma-text-01">
            Icons
          </h3>
        </div>
      </div>

      <div
        class="p-2 grid grid-cols-5 gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar"
      >
        <Button
          v-for="(iconComponent, iconName) in ICONS"
          :key="iconName"
          variant="ghost"
          class="h-9 w-9 p-0 hover:bg-toolbar-btn-bg-hover transition-colors rounded-lg flex items-center justify-center group"
          :title="iconName"
          @click="handleIconClick(iconName as string)"
        >
          <component
            :is="iconComponent"
            class="w-5 h-5 text-ma-text-02 group-hover:text-ma-text-01 transition-colors"
            style="color: inherit"
          />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Smile } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ICONS } from '@/components/Icons'
import { useElementsStore } from '@/stores/elements/elements'
import { defaultOutlineColor } from '@/types/DefaultColors'

defineProps<{
  collapsed?: boolean
}>()

const elementsStore = useElementsStore()

const handleIconClick = (iconName: string) => {
  elementsStore.addIcon(iconName)
}
</script>

<style scoped>
/* Custom scrollbar for a cleaner look */
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
