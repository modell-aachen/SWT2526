import { useElementsStore } from '@/stores/elements/elements'
import type { Snapshot } from '@/stores/elements/elements'

interface KeyboardShortcutOptions {
  saveToFile: (data: Snapshot) => void
}

/**
 * Manages keyboard shortcuts for the edit page.
 * Call setup() to start listening, cleanup() to stop.
 */
export function useKeyboardShortcuts(options: KeyboardShortcutOptions) {
  const elementsStore = useElementsStore()

  const handleKeyDown = (e: KeyboardEvent) => {
    const isMod = e.ctrlKey || e.metaKey

    // Save shortcut
    if (isMod && e.key === 's') {
      e.preventDefault()
      options.saveToFile(elementsStore.exportSnapshot())
      return
    }

    // Arrow key movement
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
      elementsStore.selectedElementIds.length > 0
    ) {
      e.preventDefault()

      const step = e.shiftKey ? 20 : 5
      let dx = 0
      let dy = 0

      switch (e.key) {
        case 'ArrowUp':
          dy = -step
          break
        case 'ArrowDown':
          dy = step
          break
        case 'ArrowLeft':
          dx = -step
          break
        case 'ArrowRight':
          dx = step
          break
      }

      elementsStore.selectedElementIds.forEach((id) => {
        elementsStore.updateElementPosition(id, dx, dy)
      })
      elementsStore.saveSnapshot()
    }

    // Group selected elements with Ctrl+G
    if (isMod && e.key === 'g' && !e.shiftKey) {
      e.preventDefault()
      elementsStore.groupSelectedElements()
    }

    // Ungroup with Ctrl+Shift+G
    if (isMod && e.shiftKey && e.key === 'G') {
      e.preventDefault()
      elementsStore.ungroupSelectedElements()
    }
  }

  // Start listening immediately
  window.addEventListener('keydown', handleKeyDown)

  const cleanup = () => {
    window.removeEventListener('keydown', handleKeyDown)
  }

  return { cleanup }
}
