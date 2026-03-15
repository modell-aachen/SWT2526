<template>
  <div
    v-if="infoText"
    class="px-2 py-1.5 bg-ma-grey-200 rounded text-xs text-ma-text-02"
  >
    {{ infoText }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { GroupElement } from '@/types/GroupElement'

const elementsStore = useElementsStore()

const infoText = computed(() => {
  const selected = elementsStore.selectedElements
  if (selected.length === 0) return ''

  if (selected.length === 1) {
    const el = selected[0]
    if (el.type === 'group') {
      const group = el as GroupElement
      return `Editing group (${group.childIds.length} elements)`
    }
    return null // Single element, no banner needed
  }

  // Multiple elements selected
  const counts = { shape: 0, text: 0, icon: 0, group: 0 }
  selected.forEach((el) => {
    counts[el.type]++
  })

  const parts: string[] = []
  if (counts.shape > 0)
    parts.push(`${counts.shape} shape${counts.shape > 1 ? 's' : ''}`)
  if (counts.text > 0)
    parts.push(`${counts.text} text${counts.text > 1 ? 's' : ''}`)
  if (counts.icon > 0)
    parts.push(`${counts.icon} icon${counts.icon > 1 ? 's' : ''}`)
  if (counts.group > 0)
    parts.push(`${counts.group} group${counts.group > 1 ? 's' : ''}`)

  const total = selected.length
  if (parts.length === 1) {
    return `Editing ${parts[0]}`
  }
  return `Editing ${total} elements (${parts.join(', ')})`
})
</script>
