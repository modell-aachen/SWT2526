import type { ResizeHandle } from '@/utils/elementTransforms'

export type ElementWrapperEvents = {
  (event: 'select', e: MouseEvent): void
  (event: 'click', e: MouseEvent): void
  (event: 'drag-start', e: MouseEvent): void
  (event: 'drag', deltaX: number, deltaY: number): void
  (event: 'drag-end'): void
  (event: 'resize-start', position: string, mouseEvent: MouseEvent): void
  (event: 'resize', handle: ResizeHandle, deltaX: number, deltaY: number): void
  (event: 'resize-end'): void
}
