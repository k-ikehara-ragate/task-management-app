<template>
  <div class="tasks-page">
    <AppDashboardHeader
      title="タスク一覧"
      subtitle="担当者・期日順で確認し、登録・編集ができます"
    />
    <p class="tasks-page__placeholder">
      タスク一覧・担当者フィルタ・期日順表示は次のフェーズで実装します。
    </p>
  </div>
</template>

<script setup lang="ts">
// タスク一覧画面（RAG requirements: F-03, F-04, F-05）
</script>

<style scoped>
.tasks-page {
  padding: var(--space-6);
}

.tasks-page__placeholder {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}
</style>
