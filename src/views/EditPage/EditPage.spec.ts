import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import EditPage from './EditPage.vue'
import { useShapesStore } from '../../stores/shapes/shapes'
import ShapeWrapper from '../../components/ShapeWrapper/ShapeWrapper.vue'
import Toolbar from '../../components/Toolbar/Toolbar.vue'
import GridCanvas from '../../components/GridCanvas/GridCanvas.vue'

describe('EditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('page structure', () => {
    it('renders the page container', () => {
      const wrapper = mount(EditPage)

      const container = wrapper.find('[data-testid="edit-page-container"]')
      expect(container.exists()).toBe(true)
    })

    it('renders Toolbar component', () => {
      const wrapper = mount(EditPage)

      expect(wrapper.findComponent(Toolbar).exists()).toBe(true)
    })

    it('renders GridCanvas component', () => {
      const wrapper = mount(EditPage)

      expect(wrapper.findComponent(GridCanvas).exists()).toBe(true)
    })

    it('renders no shapes initially', () => {
      const wrapper = mount(EditPage)

      expect(wrapper.findAllComponents(ShapeWrapper)).toHaveLength(0)
    })

    it('renders shapes from store', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const wrapper = mount(EditPage)

      expect(wrapper.findAllComponents(ShapeWrapper)).toHaveLength(2)
    })
  })

  describe('toolbar integration', () => {
    it('passes hasCopiedShape prop to Toolbar', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.copySelectedShape()

      const wrapper = mount(EditPage)
      const toolbar = wrapper.findComponent(Toolbar)

      expect(toolbar.props('hasCopiedShape')).toBe(true)
    })

    it('shows confirmation and clears all when Toolbar emits clear-all', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const wrapper = mount(EditPage)
      const toolbar = wrapper.findComponent(Toolbar)

      await toolbar.vm.$emit('clear-all')

      expect(store.shapes).toHaveLength(0)
    })

    it('does not clear shapes when clear-all is cancelled', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false)

      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')

      const wrapper = mount(EditPage)
      const toolbar = wrapper.findComponent(Toolbar)

      await toolbar.vm.$emit('clear-all')

      expect(store.shapes).toHaveLength(2)
    })
  })

  describe('canvas integration', () => {
    it('deselects shape when GridCanvas emits canvas-click', async () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      const wrapper = mount(EditPage)
      const gridCanvas = wrapper.findComponent(GridCanvas)

      await gridCanvas.vm.$emit('canvas-click')

      expect(store.selectedShapeId).toBeNull()
    })

    it('deletes selected shape when GridCanvas emits delete-selected', async () => {
      const store = useShapesStore()
      store.addShape('rectangle')

      const wrapper = mount(EditPage)
      const gridCanvas = wrapper.findComponent(GridCanvas)

      await gridCanvas.vm.$emit('delete-selected')

      expect(store.shapes).toHaveLength(0)
    })
  })

  describe('shape interactions', () => {
    it('selects shape when clicking on ShapeWrapper', async () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      const shapeId = store.shapes[0].id
      store.selectShape(null) // Deselect first

      const wrapper = mount(EditPage)
      const shapeWrapper = wrapper.findComponent(ShapeWrapper)

      await shapeWrapper.vm.$emit('click', new MouseEvent('click'))

      expect(store.selectedShapeId).toBe(shapeId)
    })

    it('passes correct props to ShapeWrapper', () => {
      const store = useShapesStore()
      store.addShape('rectangle', 150, 200)
      store.shapes[0].width = 120
      store.shapes[0].height = 180
      store.shapes[0].outline = '#ff0000'
      store.shapes[0].fill = '#0000ff'

      const wrapper = mount(EditPage)
      const shapeWrapper = wrapper.findComponent(ShapeWrapper)

      expect(shapeWrapper.props('x')).toBe(150)
      expect(shapeWrapper.props('y')).toBe(200)
      expect(shapeWrapper.props('width')).toBe(120)
      expect(shapeWrapper.props('height')).toBe(180)
      expect(shapeWrapper.props('shapeType')).toBe('rectangle')
      expect(shapeWrapper.props('outline')).toBe('#ff0000')
      expect(shapeWrapper.props('fill')).toBe('#0000ff')
      expect(shapeWrapper.props('selected')).toBe(true)
    })

    it('updates shape position when ShapeWrapper emits drag', async () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)

      const wrapper = mount(EditPage)
      const shapeWrapper = wrapper.findComponent(ShapeWrapper)

      await shapeWrapper.vm.$emit('drag', 25, 35)

      expect(store.shapes[0].x).toBe(125)
      expect(store.shapes[0].y).toBe(135)
    })

    it('updates shape size when ShapeWrapper emits resize', async () => {
      const store = useShapesStore()
      store.addShape('rectangle', 100, 100)

      const wrapper = mount(EditPage)
      const shapeWrapper = wrapper.findComponent(ShapeWrapper)

      await shapeWrapper.vm.$emit('resize', 'se', 30, 40)

      expect(store.shapes[0].width).toBe(130)
      expect(store.shapes[0].height).toBe(140)
    })
  })

  describe('shape rendering', () => {
    it('renders shapes in sorted order by zIndex', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      store.addShape('trapezoid')

      const wrapper = mount(EditPage)
      const shapeWrappers = wrapper.findAllComponents(ShapeWrapper)

      expect(shapeWrappers).toHaveLength(3)
      expect(shapeWrappers[0]?.props('shapeType')).toBe('rectangle')
      expect(shapeWrappers[1]?.props('shapeType')).toBe('triangle')
      expect(shapeWrappers[2]?.props('shapeType')).toBe('trapezoid')
    })

    it('renders all shapes from store', () => {
      const store = useShapesStore()
      store.addShape('rectangle')
      store.addShape('triangle')
      store.addShape('trapezoid')
      store.addShape('rectangle')

      const wrapper = mount(EditPage)

      expect(wrapper.findAllComponents(ShapeWrapper)).toHaveLength(4)
    })
  })
})
