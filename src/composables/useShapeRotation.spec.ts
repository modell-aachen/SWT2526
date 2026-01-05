import { describe, it, expect } from 'vitest'
import { useShapeRotation } from './useShapeRotation'
import { useShapeBasePoints } from './useShapeBasePoints'

describe('useShapeRotation', () => {
  const { parsePoints, rotatePoint, pointsToString, getRotatedPoints } =
    useShapeRotation()
  const { getBasePoints } = useShapeBasePoints()

  describe('parsePoints', () => {
    it('parses a valid SVG points string into Point objects', () => {
      const pointsString = '10,20 30,40 50,60'
      const result = parsePoints(pointsString)

      expect(result).toEqual([
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 50, y: 60 },
      ])
    })

    it('can handle a single point', () => {
      const pointsString = '25,75'
      const result = parsePoints(pointsString)

      expect(result).toEqual([{ x: 25, y: 75 }])
    })

    it('can handle a decimal coordinates', () => {
      const pointsString = '10.5,20.7 30.3,40.2 50,60'
      const result = parsePoints(pointsString)

      expect(result).toEqual([
        { x: 10.5, y: 20.7 },
        { x: 30.3, y: 40.2 },
        { x: 50, y: 60 },
      ])
    })

    describe('pointsToString', () => {
      it('converts an array of points to SVG points string', () => {
        const points = [
          { x: 10, y: 20 },
          { x: 30, y: 40 },
          { x: 50, y: 60 },
        ]
        const result = pointsToString(points)

        expect(result).toBe('10,20 30,40 50,60')
      })

      it('can handle a single point', () => {
        const points = [{ x: 25, y: 75 }]
        const result = pointsToString(points)

        expect(result).toBe('25,75')
      })

      it('can handle decimal coordinates', () => {
        const points = [
          { x: 10.5, y: 20.3 },
          { x: 30.7, y: 40.9 },
        ]
        const result = pointsToString(points)

        expect(result).toBe('10.5,20.3 30.7,40.9')
      })
    })

    describe('rotatePoint', () => {
      it('doesnt change a point at the center when rotated', () => {
        const point = { x: 50, y: 50 }
        const result = rotatePoint(point, 90)

        expect(result.x).toBeCloseTo(50, 5)
        expect(result.y).toBeCloseTo(50, 5)
      })

      it('rotates a point by 90 degrees clockwise', () => {
        const point = { x: 0, y: 50 } // Left
        const result = rotatePoint(point, 90)

        // After 90° clockwise: left becomes top, in SVG Y-coordinate increases downwards
        expect(result.x).toBeCloseTo(50, 5)
        expect(result.y).toBeCloseTo(0, 5)
      })

      it('rotates a point by 180 degrees', () => {
        const point = { x: 50, y: 5 } // Top
        const result = rotatePoint(point, 180)

        // After 180°: top becomes bottom, in SVG Y-coordinate increases downwards
        expect(result.x).toBeCloseTo(50, 5)
        expect(result.y).toBeCloseTo(95, 5)
      })

      it('rotates a point by 270 degrees clockwise', () => {
        const point = { x: 0, y: 50 } // Left
        const result = rotatePoint(point, 270)

        // After 270° clockwise: left becomes bottom, in SVG Y-coordinate increases downwards
        expect(result.x).toBeCloseTo(50, 5)
        expect(result.y).toBeCloseTo(100, 5)
      })

      it('returns to original position after 360 degrees', () => {
        const point = { x: 75, y: 25 }
        const result = rotatePoint(point, 360)

        expect(result.x).toBeCloseTo(75, 5)
        expect(result.y).toBeCloseTo(25, 5)
      })
    })

    it('returns base points when rotation is 360', () => {
      const basePoints = getBasePoints('triangle')
      const result = getRotatedPoints(basePoints, 360)
      const points = parsePoints(result)
      const baseParsedPoints = parsePoints(basePoints)

      expect(points[0].x).toBeCloseTo(baseParsedPoints[0].x, 5)
      expect(points[0].y).toBeCloseTo(baseParsedPoints[0].y, 5)

      expect(points[1].x).toBeCloseTo(baseParsedPoints[1].x, 5)
      expect(points[1].y).toBeCloseTo(baseParsedPoints[1].y, 5)

      expect(points[2].x).toBeCloseTo(baseParsedPoints[2].x, 5)
      expect(points[2].y).toBeCloseTo(baseParsedPoints[2].y, 5)
    })

    it('rotates all given points of a rectangular shape by 90 degrees clockwise', () => {
      const result = getRotatedPoints('40,45 60,45 60,55 40,55', 90)
      const points = parsePoints(result)

      // Original point (40,45) rotates 90° clockwise around (50,50)
      expect(points[0].x).toBeCloseTo(55, 5)
      expect(points[0].y).toBeCloseTo(40, 5)

      // Original point (60,45) rotates 90° clockwise around (50,50)
      expect(points[1].x).toBeCloseTo(55, 5)
      expect(points[1].y).toBeCloseTo(60, 5)

      // Original point (60,55) rotates 90° clockwise around (50,50)
      expect(points[2].x).toBeCloseTo(45, 5)
      expect(points[2].y).toBeCloseTo(60, 5)

      // Original point (40,55) rotates 90° clockwise around (50,50)
      expect(points[3].x).toBeCloseTo(45, 5)
      expect(points[3].y).toBeCloseTo(40, 5)
    })

    it('can handle multiple 90 degree rotations', () => {
      const rotation0 = parsePoints(getBasePoints('triangle'))

      const rotation90 = parsePoints(
        getRotatedPoints(pointsToString(rotation0), 90)
      )

      const rotation180 = parsePoints(
        getRotatedPoints(pointsToString(rotation90), 90)
      )

      const rotation270 = parsePoints(
        getRotatedPoints(pointsToString(rotation180), 90)
      )

      //Top
      expect(rotation0[0].x).toBe(50)
      expect(rotation0[0].y).toBe(5)

      //Top turned right after rotation by 90 degrees
      expect(rotation90[0].x).toBeCloseTo(95, 5)
      expect(rotation90[0].y).toBeCloseTo(50, 5)

      //Top turned bottom after rotation by another 90 degrees
      expect(rotation180[0].x).toBeCloseTo(50, 5)
      expect(rotation180[0].y).toBeCloseTo(95, 5)

      //Top turned left after rotation by another 90 degrees
      expect(rotation270[0].x).toBeCloseTo(5, 5)
      expect(rotation270[0].y).toBeCloseTo(50, 5)

      //Right
      expect(rotation0[1].x).toBe(95)
      expect(rotation0[1].y).toBe(95)

      //Right turned bottom after rotation by 90 degrees
      expect(rotation90[1].x).toBeCloseTo(5, 5)
      expect(rotation90[1].y).toBeCloseTo(95, 5)

      //Right turned top left after rotation by another 90 degrees
      expect(rotation180[1].x).toBeCloseTo(5, 5)
      expect(rotation180[1].y).toBeCloseTo(5, 5)

      //Left
      expect(rotation0[2].x).toBe(5)
      expect(rotation0[2].y).toBe(95)

      //Left turnes top after rotation by 90 degrees
      expect(rotation90[2].x).toBeCloseTo(5, 5)
      expect(rotation90[2].y).toBeCloseTo(5, 5)

      //Left turnes top right after rotation by another 90 degrees
      expect(rotation180[2].x).toBeCloseTo(95, 5)
      expect(rotation180[2].y).toBeCloseTo(5, 5)

      //Right turned top after rotation by another 90 degrees
      expect(rotation270[1].x).toBeCloseTo(95, 5)
      expect(rotation270[1].y).toBeCloseTo(5, 5)

      //Left turnes bottom after rotation by another 90 degrees
      expect(rotation270[2].x).toBeCloseTo(95, 5)
      expect(rotation270[2].y).toBeCloseTo(95, 5)
    })
  })
})
