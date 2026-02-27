import type { Snapshot } from '@/stores/elements/elements'
import processLandscapeConstructionSnapshot from './process-landscape-Construction.json'
import processLandscapeIMSMarketSnapshot from './process-landscape-IMSMarket.json'

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
]
