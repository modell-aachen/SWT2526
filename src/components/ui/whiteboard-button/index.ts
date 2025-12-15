import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as WhiteboardButton } from './WhiteboardButton.vue'

export const whiteboardButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none',
  {
    variants: {
      variant: {
        default:
          'border border-ma-primary-500 bg-ma-primary-500 text-white hover:bg-ma-primary-600 hover:border-ma-primary-600',
        secondary:
          'border border-ma-grey-500 bg-ma-white text-ma-grey-900 hover:bg-ma-grey-200 hover:border-ma-grey-600',
        destructive:
          'border border-ma-danger bg-ma-danger text-white hover:bg-ma-red-700',
        ghost:
          'border border-ma-grey-500 bg-ma-grey-500 text-white hover:bg-ma-grey-600 hover:border-ma-grey-600',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5 text-xs',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type WhiteboardButtonVariants = VariantProps<
  typeof whiteboardButtonVariants
>
