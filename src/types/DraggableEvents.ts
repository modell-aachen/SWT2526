export type DraggableEvents = {
  (event: 'drag', deltaX: number, deltyY: number): void
  (event: 'dragStart', mouseEvent: MouseEvent): void
  (event: 'dragEnd'): void
  (event: 'click', mouseEvent: MouseEvent): void
}
