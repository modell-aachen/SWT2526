import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('useDarkMode', () => {
  beforeEach(() => {
    // Reset document class
    document.documentElement.classList.remove('dark-mode')
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('starts with light mode by default', async () => {
      const { useDarkMode } = await import('./useDarkMode')
      const { isDark } = useDarkMode()
      expect(isDark.value).toBe(false)
    })

    it('reads dark mode from localStorage if set to true', async () => {
      localStorage.setItem('darkMode', 'true')
      const { useDarkMode } = await import('./useDarkMode')
      const { isDark } = useDarkMode()
      expect(isDark.value).toBe(true)
    })

    it('reads light mode from localStorage if set to false', async () => {
      localStorage.setItem('darkMode', 'false')
      const { useDarkMode } = await import('./useDarkMode')
      const { isDark } = useDarkMode()
      expect(isDark.value).toBe(false)
    })
  })

  describe('toggle', () => {
    it('toggles from light to dark', async () => {
      const { useDarkMode } = await import('./useDarkMode')
      const { isDark, toggle } = useDarkMode()
      toggle()
      expect(isDark.value).toBe(true)
    })

    it('toggles from dark to light', async () => {
      localStorage.setItem('darkMode', 'true')
      const { useDarkMode } = await import('./useDarkMode')
      const { isDark, toggle } = useDarkMode()
      toggle()
      expect(isDark.value).toBe(false)
    })

    it('adds dark class to document when toggled on', async () => {
      const { useDarkMode } = await import('./useDarkMode')
      const { toggle } = useDarkMode()
      toggle()
      expect(document.documentElement.classList.contains('dark-mode')).toBe(
        true
      )
    })

    it('removes dark class from document when toggled off', async () => {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
      const { useDarkMode } = await import('./useDarkMode')
      const { toggle } = useDarkMode()
      toggle()
      expect(document.documentElement.classList.contains('dark-mode')).toBe(
        false
      )
    })

    it('persists state to localStorage', async () => {
      const { useDarkMode } = await import('./useDarkMode')
      const { toggle } = useDarkMode()
      toggle()
      expect(localStorage.getItem('darkMode')).toBe('true')
      toggle()
      expect(localStorage.getItem('darkMode')).toBe('false')
    })
  })
})
