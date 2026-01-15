import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyNumericInput from './PropertyNumericInput.vue'

describe('PropertyNumericInput', () => {
  it('renders correctly with label', () => {
    const wrapper = mount(PropertyNumericInput, {
      props: {
        modelValue: 10,
        label: 'Numeric Label',
        id: 'num-id',
      },
    })

    expect(wrapper.text()).toContain('Numeric Label')
    expect(wrapper.find('#num-id').exists()).toBe(true)
    expect((wrapper.find('#num-id').element as HTMLInputElement).value).toBe(
      '10'
    )
  })

  it('updates modelValue on input', async () => {
    const wrapper = mount(PropertyNumericInput, {
      props: {
        modelValue: 10,
        label: 'Numeric Label',
        id: 'num-id',
      },
    })

    const input = wrapper.find('#num-id')
    await input.setValue('20')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([20])
  })

  it('emits change event', async () => {
    const wrapper = mount(PropertyNumericInput, {
      props: {
        modelValue: 10,
        label: 'Numeric Label',
        id: 'num-id',
      },
    })

    const input = wrapper.find('#num-id')
    await input.setValue('20')
    await input.trigger('change')

    expect(wrapper.emitted('change')?.[0]).toEqual([20])
  })
})
