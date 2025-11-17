import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Rectangle from './Rectangle.vue';

describe('Rectangle', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 100,
        height: 100,
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('applies width and height props to SVG', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 150,
        height: 200,
      },
    });

    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('150');
    expect(svg.attributes('height')).toBe('200');
  });

  it('maintains viewBox of 0 0 100 100', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 150,
        height: 200,
      },
    });

    const svg = wrapper.find('svg');
    expect(svg.attributes('viewBox')).toBe('0 0 100 100');
  });

  it('applies outline prop to polygon stroke', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 100,
        height: 100,
        outline: '#ff0000',
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('stroke')).toBe('#ff0000');
  });

  it('applies fill prop to polygon', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 100,
        height: 100,
        fill: '#00ff00',
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('fill')).toBe('#00ff00');
  });

  it('uses default outline color when not provided', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 100,
        height: 100,
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('stroke')).toBe('#000');
  });

  it('uses default transparent fill when not provided', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 100,
        height: 100,
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('fill')).toBe('transparent');
  });

  it('renders polygon with correct rectangle points', () => {
    const wrapper = mount(Rectangle, {
      props: {
        width: 100,
        height: 100,
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('points')).toBe('5,5 95,5 95,95 5,95');
  });
});
