<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'ライトテーマに切替' : 'ダークテーマに切替'"
    @click="toggle"
  >
    <span class="theme-toggle__icon" aria-hidden="true">{{ isDark ? '☀' : '☽' }}</span>
    <span class="theme-toggle__label">{{ isDark ? 'ライト' : 'ダーク' }}</span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--sidebar-text);
  background: transparent;
  border: 1px solid var(--sidebar-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--sidebar-text-active);
}

.theme-toggle__icon {
  font-size: 1rem;
  line-height: 1;
}

.theme-toggle__label {
  line-height: 1;
}
</style>
