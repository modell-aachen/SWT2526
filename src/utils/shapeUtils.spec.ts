import { describe, it, expect } from 'vitest'
import { normalizePoints } from './shapeUtils'

describe('normalizePoints', () => {
  const testCases = [
    {
      name: 'normalizes points smaller than 0-100',
      input: '10,20 50,20 50,40 10,40',
      expected: '0,0 100,0 100,100 0,100',
    },
    {
      name: 'handles triangle shape',
      input: '50,10 75,90 25,90',
      expected: '50,0 100,100 0,100',
    },
    {
      name: 'handles decimal values and rounds to integers',
      input: '0,0 50.5,0 50.5,50.5 0,50.5',
      expected: '0,0 100,0 100,100 0,100',
    },
  ]

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(normalizePoints(input)).toBe(expected)
    })
  })

  describe('invalid input', () => {
    const invalidCases = ['', 'invalid', 'not,a,valid,format']

    invalidCases.forEach((input) => {
      it(`returns empty string for "${input || 'empty string'}"`, () => {
        expect(normalizePoints(input)).toBe('')
      })
    })
  })
})
