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
          :class="['text-ma-text-01', collapsed ? 'w-4 h-4' : 'w-4 h-4']"
        />
        <span v-if="!collapsed" class="text-sm text-ma-text-01">Icons</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="w-64 p-2 bg-ma-surface shadow-xl border-ma-grey-300"
      align="start"
      side="right"
      :side-offset="10"
    >
      <div class="grid grid-cols-4 gap-1">
        <Button
          v-for="(iconComponent, iconName) in ICONS"
          :key="iconName"
          variant="ghost"
          class="h-9 w-9 p-0 text-ma-text-01"
          :title="iconName"
          @click="handleIconClick(iconName as string)"
        >
          <component :is="iconComponent" class="w-5 h-5 text-ma-text-01" />
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

defineProps<{
  collapsed?: boolean
}>()

const elementsStore = useElementsStore()

const handleIconClick = (iconName: string) => {
  elementsStore.addIcon(iconName)
}
</script>
