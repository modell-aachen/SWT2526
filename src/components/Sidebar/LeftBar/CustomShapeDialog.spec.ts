import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CustomShapeDialog from './CustomShapeDialog.vue'
import { useElementsStore } from '@/stores/elements/elements'

describe('CustomShapeDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    config.global.stubs = {
      Dialog: { template: '<div><slot /></div>' },
      DialogContent: { template: '<div><slot /></div>' },
      DialogHeader: { template: '<div><slot /></div>' },
      DialogTitle: { template: '<div><slot /></div>' },
      DialogFooter: { template: '<div><slot /></div>' },
      // Stub icons to avoid rendering issues
      Plus: true,
      Minus: true,
    }
  })

  afterEach(() => {
    config.global.stubs = {}
  })

  it('renders correctly with initial 2 points', () => {
    const wrapper = mount(CustomShapeDialog, {
      props: { open: true },
    })

    expect(wrapper.text()).toContain('Add Custom Shape')
    // Should have 2 sets of X/Y inputs initially
    const inputs = wrapper.findAll('input[type="number"]')
    expect(inputs).toHaveLength(4) // 2 points * 2 coords
  })
  it('does not add more than 6 points', async () => {
    const wrapper = mount(CustomShapeDialog, {
      props: { open: true },
    })

    const addButton = wrapper.find('[data-testid="add-point-button"]')
    // Start with 2, add 4 more to reach 6
    await addButton.trigger('click') // 3
    await addButton.trigger('click') // 4
    await addButton.trigger('click') // 5
    await addButton.trigger('click') // 6

    expect(wrapper.findAll('input[type="number"]')).toHaveLength(12) // 6 * 2

    // Try adding 7th
    await addButton.trigger('click')
    expect(wrapper.findAll('input[type="number"]')).toHaveLength(12) // Still 6 * 2
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('saves shape with generated points string', async () => {
    const store = useElementsStore()
    const wrapper = mount(CustomShapeDialog, {
      props: { open: true },
    })

    const nameInput = wrapper.find('input[placeholder="Shape Name"]') // Should be name
    await nameInput.setValue('Triangle')

    // Set 3 points: (0,0), (100,0), (50,100)
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0]!.setValue(0)
    await inputs[1]!.setValue(0)

    await inputs[2]!.setValue(100)
    await inputs[3]!.setValue(0)

    const addButton = wrapper.find('[data-testid="add-point-button"]')
    await addButton.trigger('click')
    const newInputs = wrapper.findAll('input[type="number"]') // Refresh list
    await newInputs[4]!.setValue(50)
    await newInputs[5]!.setValue(100)

    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')

    expect(store.customShapes).toHaveLength(1)
    expect(store.customShapes[0]).toEqual({
      name: 'Triangle',
      points: '0,0 100,0 50,100', // Expected format
    })
  })

  it('shows error feedback and disables save for invalid coordinates', async () => {
    const wrapper = mount(CustomShapeDialog, {
      props: { open: true },
    })

    const nameInput = wrapper.find('input[placeholder="Shape Name"]')
    await nameInput.setValue('Invalid Shape')

    const inputs = wrapper.findAll('input[type="number"]')

    // Enter valid values first to ensure button would otherwise be enabled
    await inputs[0]!.setValue(10)
    await inputs[1]!.setValue(10)
    await inputs[2]!.setValue(20)
    await inputs[3]!.setValue(20)

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).not.toBeDefined() // Should be enabled

    // Enter invalid value (> 100)
    await inputs[0]!.setValue(150)

    expect(wrapper.text()).toContain('Must be 0-100')
    expect(inputs[0]!.classes()).toContain('border-red-500')
    expect(submitButton.attributes('disabled')).toBeDefined()

    // Enter invalid value (< 0)
    await inputs[0]!.setValue(-10)

    expect(wrapper.text()).toContain('Must be 0-100')
    expect(inputs[0]!.classes()).toContain('border-red-500')
    expect(submitButton.attributes('disabled')).toBeDefined()

    // Fix it
    await inputs[0]!.setValue(50)
    expect(submitButton.attributes('disabled')).not.toBeDefined()
    expect(wrapper.text()).not.toContain('Must be 0-100')
  })
})
