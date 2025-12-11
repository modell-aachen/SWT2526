export type ResizeEvents = {
  (event: 'resizeStart', position: string, mouseEvent: MouseEvent): void
  (event: 'resize', handle: string, deltaX: number, deltaY: number): void
  (event: 'resizeEnd'): void
}
