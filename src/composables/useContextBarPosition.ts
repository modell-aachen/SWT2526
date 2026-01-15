import { computed } from 'vue'
import type { CSSProperties } from 'vue'

export interface ContextBarPositionProps {
  width: number
  height: number
  y: number
  rotation: number
}

export function useContextBarPosition(props: ContextBarPositionProps) {
  const BAR_HEIGHT = 40
  const TOP_OFFSET = 8

  // Calculate visual top and bottom relative to the center
  // The context bar should be positioned relative to the visual bounds
  const verticalBounds = computed(() => {
    const w = props.width
    const h = props.height
    const r = (props.rotation * Math.PI) / 180

    // Center is (w/2, h/2) relative to top-left of unrotated box
    // Corners relative to center
    const corners = [
      { x: -w / 2, y: -h / 2 }, // Top Left
      { x: w / 2, y: -h / 2 }, // Top Right
      { x: w / 2, y: h / 2 }, // Bottom Right
      { x: -w / 2, y: h / 2 }, // Bottom Left
    ]

    // Rotate corners
    const rotatedCorners = corners.map((p) => ({
      x: p.x * Math.cos(r) - p.y * Math.sin(r),
      y: p.x * Math.sin(r) + p.y * Math.cos(r),
    }))

    // Find min Y (top) and max Y (bottom) relative to center
    // Use Math.round to avoid floating precision issues with small epsilons
    const minY = Math.min(...rotatedCorners.map((p) => p.y))
    const maxY = Math.max(...rotatedCorners.map((p) => p.y))

    // Convert back to coordinates relative to unrotated top-left
    // Center Y is h/2
    return {
      top: Math.round(h / 2 + minY),
      bottom: Math.round(h / 2 + maxY),
    }
  })

  const barStyle = computed<CSSProperties>(() => {
    const { top, bottom } = verticalBounds.value

    // Visual top of the shape in absolute coordinates
    const visualTopY = props.y + top

    // Position above if there is space
    const positionAbove = visualTopY > BAR_HEIGHT + TOP_OFFSET

    return {
      left: '50%',
      transform: 'translateX(-50%)',
      ...(positionAbove
        ? { top: `${top - BAR_HEIGHT - TOP_OFFSET}px` } // Position relative to wrapper top
        : { top: `${bottom + TOP_OFFSET}px` }), // Position relative to wrapper top (which is 0) + visual bottom
    }
  })

  return {
    barStyle,
  }
}
