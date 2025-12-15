<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { whiteboardButtonVariants } from './index'

type WhiteboardButtonVariants = VariantProps<typeof whiteboardButtonVariants>

interface Props extends PrimitiveProps {
  variant?: WhiteboardButtonVariants['variant']
  size?: WhiteboardButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    data-slot="whiteboard-button"
    :as="as"
    :as-child="asChild"
    :class="cn(whiteboardButtonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
