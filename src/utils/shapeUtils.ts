function parsePoints(pointsString: string): { x: number; y: number }[] {
  if (!pointsString || !pointsString.trim()) return []

  const points: { x: number; y: number }[] = []
  const pairs = pointsString.trim().split(/\s+/)

  for (const pair of pairs) {
    const parts = pair.split(',')
    const xStr = parts[0]
    const yStr = parts[1]

    if (!xStr || !yStr) return []

    const x = parseFloat(xStr)
    const y = parseFloat(yStr)

    if (isNaN(x) || isNaN(y)) {
      return []
    }

    points.push({ x, y })
  }

  return points
}

export function normalizePoints(pointsString: string): string {
  const points = parsePoints(pointsString)

  if (points.length === 0) return ''

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const width = maxX - minX
  const height = maxY - minY

  if (width === 0 || height === 0) return pointsString

  const normalized = points.map((p) => ({
    x: Math.round(((p.x - minX) / width) * 100),
    y: Math.round(((p.y - minY) / height) * 100),
  }))

  return normalized.map((p) => `${p.x},${p.y}`).join(' ')
}
