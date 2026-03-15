import './style.css'

export { default as EditPage } from './views/EditPage/EditPage.vue'

// Export stores and composables
export { useElementsStore } from './stores/elements/elements'
export { useZoomStore } from './stores/zoom/zoom'
export { useDragStore } from './stores/drag/dragGhost'

// Export types
export * from './types/Element'
export * from './types/GroupElement'
export * from './types/snapping'
export * from './types/ShapeType'
export * from './types/ElementWrapperEvents'
export * from './types/ResizeEvents'
