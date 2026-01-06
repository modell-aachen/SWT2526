import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
  beforeEach(() => {
    // Reset document class
    document.documentElement.classList.remove('dark-mode')
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('starts with light mode by default', () => {
      const { isDark } = useDarkMode()
      expect(isDark.value).toBe(false)
    })

    it('reads dark mode from localStorage if set to true', () => {
      localStorage.setItem('darkMode', 'true')
      const { isDark } = useDarkMode()
      expect(isDark.value).toBe(true)
    })

    it('reads light mode from localStorage if set to false', () => {
      localStorage.setItem('darkMode', 'false')
      const { isDark } = useDarkMode()
      expect(isDark.value).toBe(false)
    })
  })

  describe('toggle', () => {
    it('toggles from light to dark', () => {
      const { isDark, toggle } = useDarkMode()
      toggle()
      expect(isDark.value).toBe(true)
    })

    it('toggles from dark to light', () => {
      localStorage.setItem('darkMode', 'true')
      const { isDark, toggle } = useDarkMode()
      toggle()
      expect(isDark.value).toBe(false)
    })

    it('adds dark class to document when toggled on', () => {
      const { toggle } = useDarkMode()
      toggle()
      expect(document.documentElement.classList.contains('dark-mode')).toBe(
        true
      )
    })

    it('removes dark class from document when toggled off', () => {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
      const { toggle } = useDarkMode()
      toggle()
      expect(document.documentElement.classList.contains('dark-mode')).toBe(
        false
      )
    })

    it('persists state to localStorage', () => {
      const { toggle } = useDarkMode()
      toggle()
      expect(localStorage.getItem('darkMode')).toBe('true')
      toggle()
      expect(localStorage.getItem('darkMode')).toBe('false')
    })
  })
})
