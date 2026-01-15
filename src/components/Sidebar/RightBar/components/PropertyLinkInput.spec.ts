import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyLinkInput from './PropertyLinkInput.vue'

describe('PropertyLinkInput', () => {
  it('renders correctly with label', () => {
    const wrapper = mount(PropertyLinkInput, {
      props: {
        modelValue: undefined,
        label: 'Link Label',
        id: 'link-id',
      },
    })

    expect(wrapper.text()).toContain('Link Label')
    expect(wrapper.find('#link-id').exists()).toBe(true)
  })

  it('initializes with modelValue without protocol', () => {
    const wrapper = mount(PropertyLinkInput, {
      props: {
        modelValue: 'https://example.com',
        label: 'Link Label',
        id: 'link-id',
      },
    })

    expect((wrapper.find('#link-id').element as HTMLInputElement).value).toBe(
      'example.com'
    )
  })

  it('emits save event with protocol on save button click', async () => {
    const wrapper = mount(PropertyLinkInput, {
      props: {
        modelValue: undefined,
        label: 'Link Label',
        id: 'link-id',
      },
    })

    const input = wrapper.find('#link-id')
    await input.setValue('test.com')

    const saveButton = wrapper.find('button[title="Save link"]')
    await saveButton.trigger('click')

    expect(wrapper.emitted('save')?.[0]).toEqual(['https://test.com'])
  })

  it('emits remove event on remove button click', async () => {
    const wrapper = mount(PropertyLinkInput, {
      props: {
        modelValue: 'https://test.com',
        label: 'Link Label',
        id: 'link-id',
      },
    })

    const removeButton = wrapper.find('button[title="Remove link"]')
    await removeButton.trigger('click')

    expect(wrapper.emitted('remove')).toBeTruthy()
  })
})
