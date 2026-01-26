import type { Snapshot } from '@/stores/elements/elements'

export const useCanvasIO = () => {
    const saveToFile = (snapshot: Snapshot) => {
        const data = JSON.stringify(snapshot, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'canvas.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const loadFromFile = (file: File): Promise<Snapshot> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const result = e.target?.result as string
                    resolve(JSON.parse(result) as Snapshot)
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = () => reject(reader.error)
            reader.readAsText(file)
        })
    }

    return {
        saveToFile,
        loadFromFile,
    }
}
