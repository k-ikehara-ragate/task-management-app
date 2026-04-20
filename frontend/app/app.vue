<template>
  <div class="app-root" :class="{ 'theme-dark': isDark }">
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { isDark } = useTheme()
</script>

<style>
.app-root {
  min-height: 100vh;
  background: var(--dashboard-bg);
}
</style>
