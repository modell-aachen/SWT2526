import type { Snapshot } from '@/stores/elements/elements'
import flowchartSnapshot from './flowchart.json'
import umlClassSnapshot from './uml-class.json'

export interface Template {
  name: string
  description?: string
  snapshot: Snapshot
}

export const templates: Template[] = [
  {
    name: 'Flowchart',
    description: 'A simple flowchart with a decision diamond and two branches',
    snapshot: flowchartSnapshot as Snapshot,
  },
  {
    name: 'UML Class Diagram',
    description: 'A UML class diagram with a base class and two subclasses',
    snapshot: umlClassSnapshot as Snapshot,
  },
]
