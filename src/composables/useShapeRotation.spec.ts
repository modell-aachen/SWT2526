import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useShapeRotation } from './useShapeRotation'

describe('useShapeRotation', () => {
    const {
        getBasePoints,
        parsePoints,
        rotatePoint,
        pointsToString,
        getRotatedPoints,
    } = useShapeRotation()

    describe('parsePoints', () => {
        it('should parse a valid SVG points string into Point objects', () => {
            const pointsString = '10,20 30,40 50,60'
            const result = parsePoints(pointsString)

            expect(result).toEqual([
                { x: 10, y: 20 },
                { x: 30, y: 40 },
                { x: 50, y: 60 },
            ])
        })

        it('should handle a single point', () => {
            const pointsString = '25,75'
            const result = parsePoints(pointsString)

            expect(result).toEqual([{ x: 25, y: 75 }])
        })
    })

    describe('rotatePoint', () => {
        it('should not change a point at the center when rotated', () => {
            const point = { x: 50, y: 50 }
            const result = rotatePoint(point, 90)

            expect(result.x).toBeCloseTo(50, 5)
            expect(result.y).toBeCloseTo(50, 5)
        })

        it('rotates a point by 90 degrees clockwise', () => {
            const point = { x: 0, y: 50 } // Left
            const result = rotatePoint(point, 90)

            // After 90° clockwise: left becomes top
            expect(result.x).toBeCloseTo(50, 5)
            expect(result.y).toBeCloseTo(0, 5)
        })

        it('should rotate a point 180 degrees', () => {
            const point = { x: 50, y: 5 } // Top center
            const result = rotatePoint(point, 180)

            // After 180°: top becomes bottom
            expect(result.x).toBeCloseTo(50, 5)
            expect(result.y).toBeCloseTo(95, 5)
        })

        it('should rotate a point 270 degrees clockwise', () => {
            const point = { x: 0, y: 50 } // Left
            const result = rotatePoint(point, 270)

            // After 270° clockwise: top becomes left
            expect(result.x).toBeCloseTo(50, 5)
            expect(result.y).toBeCloseTo(100, 5)
        })

        it('should return to original position after 360 degrees', () => {
            const point = { x: 75, y: 25 }
            const result = rotatePoint(point, 360)

            expect(result.x).toBeCloseTo(75, 5)
            expect(result.y).toBeCloseTo(25, 5)
        })
    })

    describe('pointsToString', () => {
        it('should convert an array of points to SVG points string', () => {
            const points = [
                { x: 10, y: 20 },
                { x: 30, y: 40 },
                { x: 50, y: 60 },
            ]
            const result = pointsToString(points)

            expect(result).toBe('10,20 30,40 50,60')
        })

        it('should handle a single point', () => {
            const points = [{ x: 25, y: 75 }]
            const result = pointsToString(points)

            expect(result).toBe('25,75')
        })

        it('should handle decimal coordinates', () => {
            const points = [
                { x: 10.5, y: 20.3 },
                { x: 30.7, y: 40.9 },
            ]
            const result = pointsToString(points)

            expect(result).toBe('10.5,20.3 30.7,40.9')
        })
    })

    describe('getBasePoints', () => {
        it('should return correct base points for rectangle', () => {
            const result = getBasePoints('rectangle')
            expect(result).toBe('5,5 95,5 95,95 5,95')
        })

        it('should return correct base points for triangle', () => {
            const result = getBasePoints('triangle')
            expect(result).toBe('50,5 95,95 5,95')
        })

        it('should return correct base points for trapezoid', () => {
            const result = getBasePoints('trapezoid')
            expect(result).toBe('25,5 75,5 95,95 5,95')
        })
    })

    describe('getRotatedPoints', () => {
        it('should return base points when rotation is 0', () => {
            const result = getRotatedPoints('rectangle', 0)
            const basePoints = getBasePoints('rectangle')

            expect(result).toBe(basePoints)
        })

        it('should rotate rectangle points 90 degrees clockwise', () => {
            const result = getRotatedPoints('40,45 60,45 60,55 40,55', 90)
            const points = parsePoints(result)

            // Original point (40,45) rotates 90° clockwise around (50,50)
            expect(points[0].x).toBeCloseTo(55, 1)
            expect(points[0].y).toBeCloseTo(40, 1)

            // Original point (60,45) rotates 90° clockwise around (50,50)
            expect(points[1].x).toBeCloseTo(55, 1)
            expect(points[1].y).toBeCloseTo(60, 1)

            // Original point (60,55) rotates 90° clockwise around (50,50)
            expect(points[2].x).toBeCloseTo(45, 1)
            expect(points[2].y).toBeCloseTo(60, 1)

            // Original point (40,55) rotates 90° clockwise around (50,50)
            expect(points[3].x).toBeCloseTo(45, 1)
            expect(points[3].y).toBeCloseTo(40, 1)
        })

        it('should rotate triangle points correctly', () => {
            const result = getRotatedPoints('triangle', 90)
            const points = parsePoints(result)

            expect(points).toHaveLength(3)
            // Verify all points are valid numbers
            points.forEach((point) => {
                expect(typeof point.x).toBe('number')
                expect(typeof point.y).toBe('number')
                expect(isNaN(point.x)).toBe(false)
                expect(isNaN(point.y)).toBe(false)
            })
        })

        it('should rotate trapezoid points correctly', () => {
            const result = getRotatedPoints('trapezoid', 180)
            const points = parsePoints(result)

            expect(points).toHaveLength(4)
            // Verify all points are valid numbers
            points.forEach((point) => {
                expect(typeof point.x).toBe('number')
                expect(typeof point.y).toBe('number')
                expect(isNaN(point.x)).toBe(false)
                expect(isNaN(point.y)).toBe(false)
            })
        })

        it('should handle 360 degree rotation returning to original', () => {
            const basePoints = getBasePoints('rectangle')
            const result = getRotatedPoints('rectangle', 360)
            const originalPoints = parsePoints(basePoints)
            const rotatedPoints = parsePoints(result)

            // Should be very close to original points
            rotatedPoints.forEach((point, index) => {
                expect(point.x).toBeCloseTo(originalPoints[index].x, 1)
                expect(point.y).toBeCloseTo(originalPoints[index].y, 1)
            })
        })

        it('should handle multiple 90 degree rotations', () => {
            const rotation90 = getRotatedPoints('triangle', 90)
            const rotation180 = getRotatedPoints('triangle', 180)
            const rotation270 = getRotatedPoints('triangle', 270)

            // All should produce different results
            expect(rotation90).not.toBe(rotation180)
            expect(rotation180).not.toBe(rotation270)
            expect(rotation270).not.toBe(rotation90)
        })
    })

    describe('useRotatedPoints', () => {
        it('should create a computed property that updates with rotation', () => {
            const { useRotatedPoints } = useShapeRotation()

            const shapeType = ref<any>('triangle')
            const rotation = ref(0)

            const rotatedPoints = useRotatedPoints(
                () => shapeType.value,
                () => rotation.value
            )

            // Initial value
            const initial = rotatedPoints.value
            expect(initial).toBe(getBasePoints('triangle'))

            // Change rotation
            rotation.value = 90
            const after90 = rotatedPoints.value
            expect(after90).not.toBe(initial)
        })
    })
})
