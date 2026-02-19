import type { Snapshot } from '@/stores/elements/elements'
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
