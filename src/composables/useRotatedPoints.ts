import { computed, type Ref } from 'vue'

interface Point {
    x: number
    y: number
}

/**
 * Composable for rotating SVG polygon points by 90° increments
 * 
 * @param basePoints - Array of points to rotate (in 100x100 viewBox coordinates)
 * @param rotation - Reactive rotation angle (0, 90, 180, or 270)
 * @returns Computed string of rotated points in SVG polygon format
 */
export function useRotatedPoints(
    basePoints: Point[],
    rotation: Ref<number>
) {
    return computed(() => {
        // Rotate points around center (50, 50) for 90° steps
        const rotated = basePoints.map(p => {
            const normalized = rotation.value % 360

            switch (normalized) {
                case 90:
                    // 90° clockwise: (x,y) → (100-y, x)
                    // Swaps axes, flips y for downward-positive coordinate system
                    return { x: 100 - p.y, y: p.x }

                case 180:
                    // 180°: (x,y) → (100-x, 100-y)
                    // Point reflection through center (50, 50)
                    return { x: 100 - p.x, y: 100 - p.y }

                case 270:
                    // 270° clockwise: (x,y) → (y, 100-x)
                    // Reverse of 90° rotation
                    return { x: p.y, y: 100 - p.x }

                default:
                    // 0° or invalid: no rotation
                    return p
            }
        })

        // Convert to SVG polygon points string format: "x1,y1 x2,y2 x3,y3"
        return rotated.map(p => `${p.x},${p.y}`).join(' ')
    })
}
