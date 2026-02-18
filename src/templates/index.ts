import type { Snapshot } from '@/stores/elements/elements'
import flowchartSnapshot from './flowchart.json'
import umlClassSnapshot from './uml-class.json'
import processLandscapeBlueSnapshot from './process-landscape-blue.json'
import processLandscapeRedSnapshot from './process-landscape-red.json'
import processLandscapePdcaSnapshot from './process-landscape-pdca.json'
import processLandscapeCorporateSnapshot from './process-landscape-corporate.json'
import processLandscapeI2mSnapshot from './process-landscape-i2m.json'

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
  {
    name: 'Prozesslandschaft (Blau)',
    description: 'Process landscape diagram with blue color scheme (German)',
    snapshot: processLandscapeBlueSnapshot as Snapshot,
  },
  {
    name: 'Prozesslandschaft (Rot)',
    description: 'Process landscape diagram with red color scheme (German)',
    snapshot: processLandscapeRedSnapshot as Snapshot,
  },
  {
    name: 'Prozesslandschaft (PDCA)',
    description:
      'PDCA process landscape with ellipse ring and core chevron processes',
    snapshot: processLandscapePdcaSnapshot as Snapshot,
  },
  {
    name: 'Prozesslandschaft (Corporate)',
    description:
      'Corporate strategy process landscape with custom arrow inputs and pentagon support shapes',
    snapshot: processLandscapeCorporateSnapshot as Snapshot,
  },
  {
    name: 'Prozesslandschaft (I2M)',
    description:
      'Idea-to-Manufacture / Order-to-Cash process landscape with two inner process rows',
    snapshot: processLandscapeI2mSnapshot as Snapshot,
  },
]
