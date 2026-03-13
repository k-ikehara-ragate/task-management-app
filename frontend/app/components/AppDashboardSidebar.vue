<template>
  <aside class="sidebar" :class="{ 'sidebar--open': isOpen }">
    <div class="sidebar__brand animate-slide-in-left">
      <span class="sidebar__logo" aria-hidden="true">T</span>
      <span class="sidebar__title">タスク管理</span>
    </div>
    <nav class="sidebar__nav">
      <NuxtLink
        to="/"
        class="sidebar__link"
        active-class="sidebar__link--active"
        @click="isOpen = false"
      >
        <span class="sidebar__icon" aria-hidden="true">▣</span>
        <span>ダッシュボード</span>
      </NuxtLink>
      <NuxtLink
        to="/tasks"
        class="sidebar__link"
        active-class="sidebar__link--active"
        @click="isOpen = false"
      >
        <span class="sidebar__icon" aria-hidden="true">☐</span>
        <span>タスク一覧</span>
      </NuxtLink>
    </nav>
    <div class="sidebar__footer animate-fade-in delay-4">
      <AppThemeToggle class="sidebar__theme-toggle" />
      <span class="sidebar__version">Phase 1</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { default: false })
</script>

<style scoped>
.sidebar {
  width: 248px;
  min-height: 100vh;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid var(--sidebar-border);
}

.sidebar__brand {
  padding: var(--space-6) var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--sidebar-border);
}

.sidebar__logo {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #fff;
  letter-spacing: -0.02em;
}

.sidebar__title {
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
  color: var(--sidebar-text-active);
}

.sidebar__nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}

.sidebar__link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--sidebar-text-active);
}

.sidebar__link--active {
  background: var(--sidebar-accent);
  color: var(--sidebar-accent-text);
}

.sidebar__icon {
  font-size: 1rem;
  opacity: 0.85;
  width: 1.25rem;
  text-align: center;
}

.sidebar__footer {
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--sidebar-border);
  font-size: 0.6875rem;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sidebar__theme-toggle {
  align-self: flex-start;
}

.sidebar__version {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar--open {
    transform: translateX(0);
  }
}
</style>
