import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Trapezoid from './Trapezoid.vue';

describe('Trapezoid', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 100,
        height: 100,
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('applies width and height props to SVG', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 130,
        height: 160,
      },
    });

    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('130');
    expect(svg.attributes('height')).toBe('160');
  });

  it('maintains viewBox of 0 0 100 100', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 130,
        height: 160,
      },
    });

    const svg = wrapper.find('svg');
    expect(svg.attributes('viewBox')).toBe('0 0 100 100');
  });

  it('applies outline prop to polygon stroke', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 100,
        height: 100,
        outline: '#ff00ff',
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('stroke')).toBe('#ff00ff');
  });

  it('applies fill prop to polygon', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 100,
        height: 100,
        fill: '#00ffff',
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('fill')).toBe('#00ffff');
  });

  it('uses default outline color when not provided', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 100,
        height: 100,
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('stroke')).toBe('#000');
  });

  it('uses default transparent fill when not provided', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 100,
        height: 100,
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('fill')).toBe('transparent');
  });

  it('renders polygon with correct trapezoid points', () => {
    const wrapper = mount(Trapezoid, {
      props: {
        width: 100,
        height: 100,
      },
    });

    const polygon = wrapper.find('polygon');
    expect(polygon.attributes('points')).toBe('25,5 75,5 95,95 5,95');
  });
});
