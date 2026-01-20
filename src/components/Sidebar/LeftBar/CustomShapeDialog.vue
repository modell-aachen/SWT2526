<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="lg:max-w-[450px] bg-ma-white text-ma-text-01 border-ma-grey-200"
    >
      <DialogHeader>
        <DialogTitle class="text-ma-text-01">Add Custom Shape</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" class="text-left text-ma-text-01">Name: </Label>
          <Input
            id="name"
            v-model="name"
            class="col-span-3 bg-ma-grey-100 text-ma-text-01 border-ma-grey-300"
            placeholder="Shape Name"
          />
        </div>

        <div class="space-y-4">
          <div
            v-for="(point, index) in points"
            :key="index"
            class="grid grid-cols-4 gap-2 items-start"
          >
            <div class="col-span-2 space-y-1">
              <Input
                type="number"
                v-model.number="point.x"
                placeholder="X"
                class="bg-ma-grey-100 text-ma-text-01 border-ma-grey-300"
                :class="{ 'border-red-500': isInvalid(point.x) }"
              />
              <p v-if="isInvalid(point.x)" class="text-[10px] text-red-500">
                Must be 0-100
              </p>
            </div>
            <div class="col-span-2 space-y-1">
              <Input
                type="number"
                v-model.number="point.y"
                placeholder="Y"
                class="bg-ma-grey-100 text-ma-text-01 border-ma-grey-300"
                :class="{ 'border-red-500': isInvalid(point.y) }"
              />
              <p v-if="isInvalid(point.y)" class="text-[10px] text-red-500">
                Must be 0-100
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mb-4">
          <Button
            type="button"
            variant="default"
            size="sm"
            @click="addPoint"
            :disabled="points.length >= 6"
            data-testid="add-point-button"
          >
            <Plus class="w-4 h-4 text-ma-text-01" />
          </Button>

          <Button
            v-if="points.length > 2"
            type="button"
            variant="destructive"
            size="sm"
            @click="removePoint"
            :disabled="points.length <= 2"
            data-testid="remove-point-button"
          >
            <Minus class="w-4 h-4 text-ma-text-01" />
          </Button>
        </div>

        <div
          class="flex w-full justify-center border border-ma-grey-600 rounded-md p-4 bg-ma-grey-400"
        >
          <div
            class="border border-ma-grey-200 rounded-md p-4 bg-ma-grey-100 w-[150px] h-[150px] flex items-center justify-center"
          >
            <GenericShape
              :width="100"
              :height="100"
              shape-type="custom"
              :custom-points="previewPointsString"
              outline="currentColor"
              fill="transparent"
              class="text-ma-text-01"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="saveShape" type="submit" :disabled="!isValid"
          >Add Shape</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import { useElementsStore } from '@/stores/elements/elements'
import { Minus, Plus } from 'lucide-vue-next'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const elementsStore = useElementsStore()

const name = ref('')
const points = ref([
  { x: 0, y: 0 },
  { x: 100, y: 0 },
])

const isInvalid = (val: number) => {
  return val < 0 || val > 100 || isNaN(val)
}

const addPoint = () => {
  if (points.value.length < 6) {
    points.value.push({ x: 50, y: 50 })
  }
}

// Clamps values strictly for the preview rendering
const previewPointsString = computed(() => {
  return points.value
    .map((p) => {
      const x = Math.min(Math.max(p.x, 0), 100)
      const y = Math.min(Math.max(p.y, 0), 100)
      return `${x},${y}`
    })
    .join(' ')
})

// Exact values for saving, but invalid ones block saving
const savePointsString = computed(() => {
  return points.value.map((p) => `${p.x},${p.y}`).join(' ')
})

const isValid = computed(() => {
  const nameValid = name.value.trim() !== ''
  const pointsCountValid = points.value.length >= 2
  const pointsValuesValid = points.value.every(
    (p) => !isInvalid(p.x) && !isInvalid(p.y)
  )
  return nameValid && pointsCountValid && pointsValuesValid
})

const removePoint = () => {
  if (points.value.length > 2) {
    points.value.pop()
  }
}

const saveShape = () => {
  if (isValid.value) {
    elementsStore.saveCustomShape(name.value, savePointsString.value)
    name.value = ''
    points.value = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]
    emit('update:open', false)
  }
}
</script>
