import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ma-primary-500/50",
  {
    variants: {
      variant: {
        default: 'bg-ma-primary-500 text-white hover:bg-ma-primary-600',
        destructive: 'bg-ma-red-600 text-white hover:bg-ma-red-700',
        outline:
          'border border-ma-grey-400 bg-ma-grey-100 shadow-xs hover:bg-ma-grey-300 text-ma-text-01',
        secondary: 'bg-ma-grey-300 text-ma-text-01 hover:bg-ma-grey-400',
        ghost: 'hover:bg-ma-grey-300 text-ma-text-01',
        link: 'text-ma-primary-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
