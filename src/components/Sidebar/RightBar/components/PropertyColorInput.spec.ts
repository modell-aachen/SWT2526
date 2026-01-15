import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyColorInput from './PropertyColorInput.vue'

describe('PropertyColorInput', () => {
  it('renders correctly with label', () => {
    const wrapper = mount(PropertyColorInput, {
      props: {
        modelValue: '#000000',
        label: 'Test Label',
        id: 'test-id',
      },
    })

    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('#test-id').exists()).toBe(true)
  })

  it('updates modelValue on input', async () => {
    const wrapper = mount(PropertyColorInput, {
      props: {
        modelValue: '#000000',
        label: 'Test Label',
        id: 'test-id',
      },
    })

    const input = wrapper.find('#test-id')
    await input.setValue('#ffffff')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#ffffff'])
  })

  it('emits change event', async () => {
    const wrapper = mount(PropertyColorInput, {
      props: {
        modelValue: '#000000',
        label: 'Test Label',
        id: 'test-id',
      },
    })

    const input = wrapper.find('#test-id')
    await input.setValue('#ffffff')
    await input.trigger('change')

    expect(wrapper.emitted('change')?.[0]).toEqual(['#ffffff'])
  })
})
