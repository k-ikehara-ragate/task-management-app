/**
 * ダーク/ライトテーマ切替
 * RAG: composable に切り出し、型を明示
 */

const STORAGE_KEY = 'app-theme'

export type ThemeMode = 'dark' | 'light'

function readStored (): ThemeMode | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(STORAGE_KEY)
  if (v === 'dark' || v === 'light') return v
  return null
}

function persist (mode: ThemeMode): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, mode)
}

export function useTheme () {
  const isDark = useState<boolean>('theme-is-dark', () => true)

  function setTheme (dark: boolean) {
    isDark.value = dark
    persist(dark ? 'dark' : 'light')
  }

  function toggle () {
    setTheme(!isDark.value)
  }

  onMounted(() => {
    const stored = readStored()
    if (stored !== null) {
      isDark.value = stored === 'dark'
    }
  })

  return { isDark: readonly(isDark), setTheme, toggle }
}
