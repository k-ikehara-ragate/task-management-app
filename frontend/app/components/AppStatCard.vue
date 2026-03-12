<template>
  <div
    class="stat-card hover-lift animate-scale-in"
    :class="delay ? `delay-${delay}` : ''"
  >
    <div class="stat-card__accent" :style="{ background: iconBg }" aria-hidden="true" />
    <div class="stat-card__body">
      <p class="stat-card__label">{{ label }}</p>
      <p class="stat-card__value">{{ value }}</p>
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
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-5);
  display: flex;
  align-items: stretch;
  gap: 0;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  overflow: hidden;
}

.stat-card__accent {
  width: 4px;
  flex-shrink: 0;
  border-radius: 2px;
}

.stat-card__body {
  flex: 1;
  min-width: 0;
  padding-left: var(--space-4);
}

.stat-card__label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-1);
  font-weight: 500;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}
</style>
