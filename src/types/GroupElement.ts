import type { BaseElement } from './Element'

export interface GroupElement extends BaseElement {
  type: 'group'
  childIds: string[] // IDs of grouped elements
}
