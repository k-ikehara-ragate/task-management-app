<template>
  <div class="dashboard-layout">
    <AppDashboardSidebar />
    <main class="dashboard-main">
      <div class="dashboard-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// ダッシュボードレイアウト（Dribbble Dashboard UI 参考）
// RAG: 一覧・登録・編集の3画面の土台
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--dashboard-bg);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dashboard-content {
  flex: 1;
}
</style>
