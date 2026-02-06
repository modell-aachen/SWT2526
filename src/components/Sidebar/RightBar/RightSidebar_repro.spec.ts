import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import RightSidebar from './RightSidebar.vue'
import { useElementsStore } from '@/stores/elements/elements'
import type { TextElement } from '@/types/Element'

describe('RightSidebar Font Family Selector', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates font family when changed', async () => {
    const store = useElementsStore()
    const textElement: TextElement = {
      id: 'text-1',
      type: 'text',
      x: 10,
      y: 10,
      width: 100,
      height: 50,
      rotation: 0,
      zIndex: 1,
      content: 'Hello',
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#000000',
    }
    store.elements = [textElement]
    store.selectedElementIds = ['text-1']

    // Mock the update action
    store.updateTextElement = vi.fn()

    const wrapper = mount(RightSidebar, {
      props: {
        isCollapsed: false,
      },
    })

    const select = wrapper.find('select#text-font-family')
    expect(select.exists()).toBe(true)
    expect((select.element as HTMLSelectElement).value).toBe('Arial')

    await select.setValue('Verdana')

    expect(store.updateTextElement).toHaveBeenCalledWith('text-1', {
      fontFamily: 'Verdana',
    })
  })
})
