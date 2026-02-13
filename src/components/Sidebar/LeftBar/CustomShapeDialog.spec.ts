import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, config, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CustomShapeDialog from './CustomShapeDialog.vue'
import { useElementsStore } from '@/stores/elements/elements'

describe('CustomShapeDialog', () => {
  let wrapper: VueWrapper

  const mountDialog = () => mount(CustomShapeDialog, { props: { open: true } })

  const getInputs = () => wrapper.findAll('input[type="number"]')
  const getNameInput = () => wrapper.find('input[placeholder="Shape Name"]')
  const getSubmitButton = () => wrapper.find('button[type="submit"]')
  const getAddPointButton = () =>
    wrapper.find('[data-testid="add-point-button"]')

  beforeEach(() => {
    setActivePinia(createPinia())
    config.global.stubs = {
      Dialog: { template: '<div><slot /></div>' },
      DialogContent: { template: '<div><slot /></div>' },
      DialogHeader: { template: '<div><slot /></div>' },
      DialogTitle: { template: '<div><slot /></div>' },
      DialogFooter: { template: '<div><slot /></div>' },
      Plus: true,
      Minus: true,
    }
  })

  afterEach(() => {
    config.global.stubs = {}
  })

  it('renders correctly with initial 3 points (6 inputs) and can maximally add 6 input points', async () => {
    wrapper = mountDialog()

    expect(wrapper.text()).toContain('Add Custom Shape')
    expect(getInputs()).toHaveLength(6)

    const addButton = getAddPointButton()

    for (let i = 0; i < 3; i++) {
      await addButton.trigger('click')
    }

    expect(getInputs()).toHaveLength(12)

    await addButton.trigger('click')
    expect(getInputs()).toHaveLength(12)
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('saves shape with generated points string', async () => {
    const store = useElementsStore()
    wrapper = mountDialog()

    await getNameInput().setValue('Triangle')

    const inputs = getInputs()
    const pointValues = [0, 100, 100, 100, 50, 0]

    for (let i = 0; i < pointValues.length; i++) {
      await inputs[i]!.setValue(pointValues[i])
    }

    await getSubmitButton().trigger('click')

    expect(store.customShapes).toHaveLength(1)
    expect(store.customShapes[0]).toEqual({
      name: 'Triangle',
      points: '0,0 100,0 50,100',
    })
  })

  it('does not allow saving when name is empty', async () => {
    wrapper = mountDialog()

    await getNameInput().setValue('')
    await getSubmitButton().trigger('click')

    expect(getSubmitButton().attributes('disabled')).toBeDefined()
  })

  it('shows error feedback and disables save for invalid coordinates', async () => {
    wrapper = mountDialog()

    await getNameInput().setValue('Invalid Shape')

    const inputs = getInputs()

    const validValues = [10, 10, 20, 20, 30, 30]
    for (let i = 0; i < validValues.length; i++) {
      await inputs[i]!.setValue(validValues[i])
    }

    const submitButton = getSubmitButton()
    expect(submitButton.attributes('disabled')).not.toBeDefined()

    await inputs[0]!.setValue(150)
    expect(wrapper.text()).toContain('Must be 0-100')
    expect(inputs[0]!.classes()).toContain('border-red-500')
    expect(submitButton.attributes('disabled')).toBeDefined()

    await inputs[0]!.setValue(-10)
    expect(wrapper.text()).toContain('Must be 0-100')
    expect(submitButton.attributes('disabled')).toBeDefined()

    await inputs[0]!.setValue(50)
    expect(submitButton.attributes('disabled')).not.toBeDefined()
    expect(wrapper.text()).not.toContain('Must be 0-100')
  })
})
