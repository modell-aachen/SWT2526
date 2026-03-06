import { ref } from 'vue'

const STORAGE_KEY = 'darkMode'

const storedValue = localStorage.getItem(STORAGE_KEY)
const isDark = ref(storedValue === 'true')

// Apply initial state immediately when the module is evaluated
if (isDark.value) {
  document.documentElement.classList.add('dark-mode')
}

export function useDarkMode() {
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
