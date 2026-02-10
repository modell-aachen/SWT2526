export const SNAP_THRESHOLD = 5 // pixels

export type SnapPointType = 'left' | 'right' | 'top' | 'bottom' | 'center-x' | 'center-y'

export interface SnapPoint {
    value: number
    type: SnapPointType
    elementId: string
}

export type SnapAxis = 'horizontal' | 'vertical'

export interface SnapLine {
    axis: SnapAxis
    position: number
    start: number
    end: number
}

export interface SnapResult {
    x: number
    y: number
    snapLines: SnapLine[]
}
