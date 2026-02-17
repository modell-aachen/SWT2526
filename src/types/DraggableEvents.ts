export type DraggableEvents = {
  (event: 'drag', deltaX: number, deltyY: number, mouseEvent: MouseEvent): void
  (event: 'drag-start', mouseEvent: MouseEvent): void
  (event: 'drag-end'): void
  (event: 'click', mouseEvent: MouseEvent): void
}
