import { ref } from 'vue'

const STORAGE_KEY = 'darkMode'

export function useDarkMode() {
  const storedValue = localStorage.getItem(STORAGE_KEY)
  const isDark = ref(storedValue === 'true')

  // Apply initial state
  if (isDark.value) {
    document.documentElement.classList.add('dark-mode')
  }

  const toggle = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    localStorage.setItem(STORAGE_KEY, String(isDark.value))
  }

  return { isDark, toggle }
}
