export type ResizeEvents = {
  (event: 'resize-start', position: string, mouseEvent: MouseEvent): void
  (event: 'resize', handle: string, deltaX: number, deltaY: number): void
  (event: 'resize-end'): void
}
