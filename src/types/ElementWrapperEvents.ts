import type { ResizeHandle } from '@/utils/elementTransforms'

export interface ElementWrapperEvents {
    (event: 'select'): void
    (event: 'click', e: MouseEvent): void
    (event: 'dragStart', e: MouseEvent): void
    (event: 'drag', deltaX: number, deltaY: number): void
    (event: 'dragEnd'): void
    (event: 'resize-start', position: string, mouseEvent: MouseEvent): void
    (event: 'resize', handle: ResizeHandle, deltaX: number, deltaY: number): void
    (event: 'resize-end'): void
}
