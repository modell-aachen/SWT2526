import type { ResizeHandle } from '@/utils/elementTransforms'

export const resizeHandles: ResizeHandle[] = [
  'nw',
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
]

export const getHandleStyle = (handle: ResizeHandle) => {
  switch (handle) {
    case 'nw':
      return { left: '-10px', top: '-10px' }
    case 'n':
      return { left: '50%', top: '-10px' }
    case 'ne':
      return { left: 'calc(100% + 10px)', top: '-10px' }
    case 'e':
      return { left: 'calc(100% + 11px)', top: '50%' }
    case 'se':
      return { left: 'calc(100% + 10px)', top: 'calc(100% + 10px)' }
    case 's':
      return { left: '50%', top: 'calc(100% + 11px)' }
    case 'sw':
      return { left: '-10px', top: 'calc(100% + 10px)' }
    case 'w':
      return { left: '-11px', top: '50%' }
  }
}
