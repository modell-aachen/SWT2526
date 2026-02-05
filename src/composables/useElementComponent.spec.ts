import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useElementComponent } from './useElementComponent'
import type { ShapeElement, TextElement, IconElement } from '@/types/Element'
import GenericShape from '@/components/Shapes/GenericShape.vue'
import TextElementComponent from '@/components/TextElement/TextElement.vue'
import IconElementComponent from '@/components/IconElement/IconElement.vue'

const createShapeElement = (
  overrides?: Partial<ShapeElement>
): ShapeElement => ({
  id: '1',
  type: 'shape',
  shapeType: 'rectangle',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  zIndex: 1,
  fill: '#000',
  outline: '#fff' /**
   * Events emitted by ElementWrapper component
   */,
  strokeWeight: 2,
  ...overrides,
})

const createTextElement = (overrides?: Partial<TextElement>): TextElement => ({
  id: '2',
  type: 'text',
  x: 0,
  y: 0,
  width: 100,
  height: 50,
  rotation: 0,
  zIndex: 1,
  content: 'Hello',
  fontSize: 16,
  fontFamily: 'Arial',
  color: '#000',
  ...overrides,
})

const createIconElement = (overrides?: Partial<IconElement>): IconElement => ({
  id: '3',
  type: 'icon',
  x: 0,
  y: 0,
  width: 24,
  height: 24,
  rotation: 0,
  zIndex: 1,
  iconType: 'star',
  color: '#000',
  strokeWeight: 2,
  ...overrides,
})

describe('useElementComponent', () => {
  describe('componentType', () => {
    it.each([
      ['shape', createShapeElement(), GenericShape],
      ['text', createTextElement(), TextElementComponent],
      ['icon', createIconElement(), IconElementComponent],
    ] as const)(
      'returns correct component for %s elements',
      (_, element, expectedComponent) => {
        const { componentType } = useElementComponent(ref(element))
        expect(componentType.value).toBe(expectedComponent)
      }
    )
  })

  describe('componentProps', () => {
    it('generates correct props for shape elements', () => {
      const element = ref(
        createShapeElement({
          width: 100,
          height: 50,
          fill: '#ff0000',
          outline: '#00ff00',
          strokeWeight: 5,
          customPoints: 'custom-data',
        })
      )

      const { componentProps } = useElementComponent(element)

      expect(componentProps.value).toEqual({
        width: 100,
        height: 50,
        fill: '#ff0000',
        outline: '#00ff00',
        strokeWeight: 5,
        rotation: 0,
        shapeType: 'rectangle',
        customPoints: 'custom-data',
      })
    })

    it('generates correct props for text elements', () => {
      const element = ref(
        createTextElement({
          content: 'Test Content',
          fontSize: 24,
          fontFamily: 'Roboto',
          color: '#0000ff',
        })
      )

      const { componentProps } = useElementComponent(element)

      expect(componentProps.value).toEqual({
        content: 'Test Content',
        color: '#0000ff',
        fontSize: 24,
        fontFamily: 'Roboto',
      })
    })

    it('generates correct props for icon elements', () => {
      const element = ref(
        createIconElement({
          iconType: 'heart',
          color: '#ff00ff',
          strokeWeight: 3,
        })
      )

      const { componentProps } = useElementComponent(element)

      expect(componentProps.value).toEqual({
        iconType: 'heart',
        color: '#ff00ff',
        strokeWeight: 3,
      })
    })
  })
})
