import type { Snapshot } from '@/stores/elements/elements'
import processLandscapeConstructionSnapshot from './process-landscape-Construction.json'
import processLandscapeIMSMarketSnapshot from './process-landscape-IMSMarket.json'
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
    name: 'Prozesslandschaft Construction',
    description: 'Process landscape diagram with blue color scheme (German)',
    snapshot: processLandscapeConstructionSnapshot as Snapshot,
  },
  {
    name: 'Prozesslandschaft IMS Markt',
    description: 'Process landscape diagram with red color scheme (German)',
    snapshot: processLandscapeIMSMarketSnapshot as Snapshot,
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
