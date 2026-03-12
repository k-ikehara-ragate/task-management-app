<template>
  <header class="header">
    <div class="header__inner animate-fade-in-up">
      <h1 class="header__title">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="header__subtitle">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style scoped>
.header {
  padding: var(--space-6) var(--space-6) 0;
  background: var(--dashboard-bg);
  border-bottom: 1px solid var(--border-subtle);
}

.header__inner {
  padding-bottom: var(--space-4);
}

.header__title {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.header__subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: var(--space-1) 0 0;
  font-weight: 400;
}
</style>
