<template>
  <div class="top-page">
    <AppDashboardHeader
      title="ダッシュボード"
      subtitle="タスクの進捗をひと目で確認できます（情シス向け）"
    />
    <div class="top-page__grid">
      <AppStatCard
        v-for="(card, i) in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :icon-bg="card.iconBg"
        :delay="(i + 1) as 1 | 2 | 3 | 4 | 5"
      />
    </div>
    <Transition name="fade-slide">
      <section class="welcome-section animate-fade-in-up delay-3">
        <h2 class="welcome-section__title">
          タスク管理ツールへようこそ
        </h2>
        <p class="welcome-section__text">
          個人のタスクの可視化と進捗把握のため、担当者フィルタ・期日順一覧・3ステータス（未対応・対応中・完了）で運用します。
        </p>
        <NuxtLink to="/tasks" class="welcome-section__cta">
          <span>タスク一覧へ</span>
          <span class="welcome-section__cta-arrow">→</span>
        </NuxtLink>
      </section>
    </Transition>
    <section class="quick-actions animate-fade-in-up delay-4">
      <h2 class="quick-actions__title">
        クイックアクション
      </h2>
      <div class="quick-actions__grid">
        <NuxtLink
          to="/tasks/new"
          class="quick-action-card hover-lift"
        >
          <span class="quick-action-card__icon" aria-hidden="true">+</span>
          <span class="quick-action-card__label">新規タスク登録</span>
        </NuxtLink>
        <NuxtLink
          to="/tasks"
          class="quick-action-card hover-lift"
        >
          <span class="quick-action-card__icon" aria-hidden="true">≡</span>
          <span class="quick-action-card__label">一覧・編集</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// トップページ（RAG requirements: タスク一覧・登録・編集の入口）
// 参考: https://dribbble.com/shots/25683483-Dashboard-UI

const statCards = [
  { label: '未対応', value: '—', iconBg: 'var(--status-pending)' },
  { label: '対応中', value: '—', iconBg: 'var(--status-progress)' },
  { label: '完了', value: '—', iconBg: 'var(--status-done)' }
]
</script>

<style scoped>
.top-page {
  padding: var(--space-6);
}

.top-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.welcome-section {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}

.welcome-section__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.welcome-section__text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-5);
  line-height: 1.6;
}

.welcome-section__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.15s ease;
}

.welcome-section__cta:hover {
  background: var(--accent-hover);
  transform: translateY(0);
}

.welcome-section__cta-arrow {
  transition: transform 0.15s ease;
}

.welcome-section__cta:hover .welcome-section__cta-arrow {
  transform: translateX(2px);
}

.quick-actions__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-4);
}

.quick-actions__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}

.quick-action-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease;
}

.quick-action-card:hover,
.quick-action-card:focus,
.quick-action-card:focus-visible {
  outline: none;
  background: var(--quick-action-focus-bg);
  border-color: var(--quick-action-focus-border);
  box-shadow: 0 0 0 2px var(--quick-action-focus-ring);
  color: var(--quick-action-focus-text);
}

.quick-action-card:hover .quick-action-card__icon,
.quick-action-card:focus .quick-action-card__icon,
.quick-action-card:focus-visible .quick-action-card__icon {
  background: var(--quick-action-focus-icon-bg);
  color: var(--quick-action-focus-icon-color);
}

.quick-action-card__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--accent-bg-subtle);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}

/* Vue Transition（アニメーション） */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
