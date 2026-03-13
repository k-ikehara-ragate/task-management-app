<template>
  <div
    class="stat-card hover-lift animate-scale-in"
    :class="delay ? `delay-${delay}` : ''"
  >
    <div class="stat-card__accent" :style="{ background: iconBg }" aria-hidden="true" />
    <div class="stat-card__body">
      <p class="stat-card__label">{{ label }}</p>
      <Transition name="value-fade" mode="out-in">
        <p :key="String(value)" class="stat-card__value">{{ value }}</p>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    iconBg?: string
    delay?: 1 | 2 | 3 | 4 | 5
  }>(),
  {
    iconBg: 'var(--accent)',
    delay: 1
  }
)

</script>

<style scoped>
.stat-card {
  background: var(--surface);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: stretch;
  gap: 0;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  overflow: hidden;
}

.stat-card__accent {
  width: 3px;
  flex-shrink: 0;
  border-radius: 2px;
}

.stat-card__body {
  flex: 1;
  min-width: 0;
  padding-left: var(--space-3);
}

.stat-card__label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-1);
  font-weight: 500;
}

.stat-card__value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.value-fade-enter-active,
.value-fade-leave-active {
  transition: opacity 0.3s ease;
}

.value-fade-enter-from,
.value-fade-leave-to {
  opacity: 0;
}
</style>
