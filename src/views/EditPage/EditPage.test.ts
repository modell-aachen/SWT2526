import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import EditPage from './EditPage.vue';
import { useShapesStore } from '../../stores/shapes/shapes';
import ShapeWrapper from '../../components/ShapeWrapper.vue';

describe('EditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('rendering', () => {
    it('renders the toolbar', () => {
      const wrapper = mount(EditPage);
      
      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('renders all shape add buttons', () => {
      const wrapper = mount(EditPage);
      
      expect(wrapper.text()).toContain('Add Rectangle');
      expect(wrapper.text()).toContain('Add Triangle');
      expect(wrapper.text()).toContain('Add Trapezoid');
    });

    it('renders delete and clear buttons', () => {
      const wrapper = mount(EditPage);
      
      expect(wrapper.text()).toContain('Delete Selected');
      expect(wrapper.text()).toContain('Clear All');
    });

    it('renders the canvas area', () => {
      const wrapper = mount(EditPage);
      
      const canvas = wrapper.find('.flex-1.relative.bg-white');
      expect(canvas.exists()).toBe(true);
    });

    it('renders grid pattern SVG', () => {
      const wrapper = mount(EditPage);
      
      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);
      expect(svg.find('pattern#grid').exists()).toBe(true);
    });

    it('renders no shapes initially', () => {
      const wrapper = mount(EditPage);
      
      expect(wrapper.findAllComponents(ShapeWrapper)).toHaveLength(0);
    });

    it('renders shapes from store', () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      store.addShape('triangle');
      
      const wrapper = mount(EditPage);
      
      expect(wrapper.findAllComponents(ShapeWrapper)).toHaveLength(2);
    });
  });

  describe('adding shapes', () => {
    it('adds rectangle when clicking Add Rectangle button', async () => {
      const wrapper = mount(EditPage);
      const store = useShapesStore();
      
      await wrapper.findAll('button')[0].trigger('click');
      
      expect(store.shapes).toHaveLength(1);
      expect(store.shapes[0].type).toBe('rectangle');
    });

    it('adds triangle when clicking Add Triangle button', async () => {
      const wrapper = mount(EditPage);
      const store = useShapesStore();
      
      await wrapper.findAll('button')[1].trigger('click');
      
      expect(store.shapes).toHaveLength(1);
      expect(store.shapes[0].type).toBe('triangle');
    });

    it('adds trapezoid when clicking Add Trapezoid button', async () => {
      const wrapper = mount(EditPage);
      const store = useShapesStore();
      
      await wrapper.findAll('button')[2].trigger('click');
      
      expect(store.shapes).toHaveLength(1);
      expect(store.shapes[0].type).toBe('trapezoid');
    });

    it('can add multiple shapes', async () => {
      const wrapper = mount(EditPage);
      const store = useShapesStore();
      
      await wrapper.findAll('button')[0].trigger('click'); // Rectangle
      await wrapper.findAll('button')[1].trigger('click'); // Triangle
      await wrapper.findAll('button')[2].trigger('click'); // Trapezoid
      
      expect(store.shapes).toHaveLength(3);
    });
  });

  describe('deleting shapes', () => {
    it('delete button is disabled when no shape is selected', () => {
      const wrapper = mount(EditPage);
      
      const deleteButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Delete Selected'
      );
      
      expect(deleteButton?.attributes('disabled')).toBeDefined();
    });

    it('delete button is enabled when shape is selected', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      
      const wrapper = mount(EditPage);
      
      const deleteButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Delete Selected'
      );
      
      expect(deleteButton?.attributes('disabled')).toBeUndefined();
    });

    it('deletes selected shape when clicking delete button', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      store.addShape('triangle');
      
      const wrapper = mount(EditPage);
      
      const deleteButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Delete Selected'
      );
      await deleteButton?.trigger('click');
      
      expect(store.shapes).toHaveLength(1);
    });
  });

  describe('clearing all shapes', () => {
    it('clears all shapes when confirming clear all', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      const store = useShapesStore();
      store.addShape('rectangle');
      store.addShape('triangle');
      store.addShape('trapezoid');
      
      const wrapper = mount(EditPage);
      
      const clearButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Clear All'
      );
      await clearButton?.trigger('click');
      
      expect(store.shapes).toHaveLength(0);
    });

    it('does not clear shapes when canceling clear all', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      const store = useShapesStore();
      store.addShape('rectangle');
      store.addShape('triangle');
      
      const wrapper = mount(EditPage);
      
      const clearButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Clear All'
      );
      await clearButton?.trigger('click');
      
      expect(store.shapes).toHaveLength(2);
    });

    it('shows confirmation dialog when clicking clear all', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      const wrapper = mount(EditPage);
      
      const clearButton = wrapper.findAll('button').find(btn => 
        btn.text() === 'Clear All'
      );
      await clearButton?.trigger('click');
      
      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to clear all shapes?');
    });
  });

  describe('shape selection', () => {
    it('selects shape when clicking on shape wrapper', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      const shapeId = store.shapes[0].id;
      store.selectShape(null); // Deselect first
      
      const wrapper = mount(EditPage);
      const shapeWrapper = wrapper.findComponent(ShapeWrapper);
      
      await shapeWrapper.vm.$emit('click', new MouseEvent('click'));
      
      expect(store.selectedShapeId).toBe(shapeId);
    });

    it('passes selected prop to shape wrapper', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      
      const wrapper = mount(EditPage);
      const shapeWrapper = wrapper.findComponent(ShapeWrapper);
      
      expect(shapeWrapper.props('selected')).toBe(true);
    });

    it('deselects when clicking on canvas', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      
      const wrapper = mount(EditPage);
      const canvas = wrapper.find('.flex-1.relative.bg-white');
      
      await canvas.trigger('mousedown');
      
      expect(store.selectedShapeId).toBeNull();
    });
  });

  describe('shape dragging', () => {
    it('updates shape position when drag event is emitted', async () => {
      const store = useShapesStore();
      store.addShape('rectangle', 100, 100);
      
      const wrapper = mount(EditPage);
      const shapeWrapper = wrapper.findComponent(ShapeWrapper);
      
      await shapeWrapper.vm.$emit('drag', 25, 35);
      
      expect(store.shapes[0].x).toBe(125);
      expect(store.shapes[0].y).toBe(135);
    });
  });

  describe('shape resizing', () => {
    it('updates shape size when resize event is emitted', async () => {
      const store = useShapesStore();
      store.addShape('rectangle', 100, 100);
      
      const wrapper = mount(EditPage);
      const shapeWrapper = wrapper.findComponent(ShapeWrapper);
      
      await shapeWrapper.vm.$emit('resize', 'se', 30, 40);
      
      expect(store.shapes[0].width).toBe(130);
      expect(store.shapes[0].height).toBe(140);
    });
  });

  describe('keyboard shortcuts', () => {
    it('deletes selected shape on Delete key', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      
      const wrapper = mount(EditPage);
      const canvas = wrapper.find('.flex-1.relative.bg-white');
      
      await canvas.trigger('keydown.delete');
      
      expect(store.shapes).toHaveLength(0);
    });

    it('deletes selected shape on Backspace key', async () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      
      const wrapper = mount(EditPage);
      const canvas = wrapper.find('.flex-1.relative.bg-white');
      
      await canvas.trigger('keydown.backspace');
      
      expect(store.shapes).toHaveLength(0);
    });
  });

  describe('shape wrapper props', () => {
    it('passes correct props to shape wrappers', () => {
      const store = useShapesStore();
      store.addShape('rectangle', 150, 200);
      store.shapes[0].width = 120;
      store.shapes[0].height = 180;
      store.shapes[0].outline = '#ff0000';
      store.shapes[0].fill = '#0000ff';
      
      const wrapper = mount(EditPage);
      const shapeWrapper = wrapper.findComponent(ShapeWrapper);
      
      expect(shapeWrapper.props('x')).toBe(150);
      expect(shapeWrapper.props('y')).toBe(200);
      expect(shapeWrapper.props('width')).toBe(120);
      expect(shapeWrapper.props('height')).toBe(180);
      expect(shapeWrapper.props('shapeType')).toBe('rectangle');
      expect(shapeWrapper.props('outline')).toBe('#ff0000');
      expect(shapeWrapper.props('fill')).toBe('#0000ff');
    });

    it('renders shapes in sorted order by zIndex', () => {
      const store = useShapesStore();
      store.addShape('rectangle');
      store.addShape('triangle');
      store.addShape('trapezoid');
      
      const wrapper = mount(EditPage);
      const shapeWrappers = wrapper.findAllComponents(ShapeWrapper);
      
      expect(shapeWrappers).toHaveLength(3);
      // Verify they are rendered in order
      expect(shapeWrappers[0].props('shapeType')).toBe('rectangle');
      expect(shapeWrappers[1].props('shapeType')).toBe('triangle');
      expect(shapeWrappers[2].props('shapeType')).toBe('trapezoid');
    });
  });
});
