import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-vue-next'

export const ICONS = {
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
}

export type IconType = keyof typeof ICONS
