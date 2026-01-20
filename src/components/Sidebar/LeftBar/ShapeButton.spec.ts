import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ShapeButton from './ShapeButton.vue'
import GenericShape from '@/components/Shapes/GenericShape.vue'

describe('ShapeButton', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('renders correct shape type', () => {
        const wrapper = mount(ShapeButton, {
            props: {
                shapeType: 'rectangle',
            },
        })
        expect(wrapper.findComponent(GenericShape).props('shapeType')).toBe('rectangle')
        expect(wrapper.text()).toContain('rectangle')
    })

    it('renders custom points when provided', () => {
        const customPoints = '0,0 100,0 50,100'
        const wrapper = mount(ShapeButton, {
            props: {
                shapeType: 'custom',
                customPoints,
            },
        })

        const shape = wrapper.findComponent(GenericShape)
        expect(shape.props('shapeType')).toBe('custom')
        expect(shape.props('customPoints')).toBe(customPoints)
    })
})
