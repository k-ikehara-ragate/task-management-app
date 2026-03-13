<template>
  <div class="top-page">
    <div class="top-page__header-row">
      <AppDashboardHeader
        title="ダッシュボード"
        subtitle="タスクの進捗をひと目で確認できます（情シス向け）"
      />
      <div class="top-page__assignee-toggle" aria-label="担当者でフィルタ">
        <span class="top-page__assignee-label">担当者</span>
        <div class="assignee-toggle" role="group">
          <button
            type="button"
            class="assignee-toggle__btn"
            :class="{ 'assignee-toggle__btn--active': selectedAssigneeId === '' }"
            @click="selectedAssigneeId = ''"
          >
            すべて
          </button>
          <button
            v-for="a in assignees"
            :key="a.id"
            type="button"
            class="assignee-toggle__btn"
            :class="{ 'assignee-toggle__btn--active': selectedAssigneeId === a.id }"
            @click="selectedAssigneeId = a.id"
          >
            {{ a.name }}
          </button>
        </div>
      </div>
    </div>
    <Transition name="stat-fade" mode="out-in">
      <div :key="selectedAssigneeId" class="top-page__grid">
        <AppStatCard
          v-for="(card, i) in statCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :icon-bg="card.iconBg"
          :delay="(i + 1) as 1 | 2 | 3 | 4 | 5"
        />
      </div>
    </Transition>
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
import type { Task, TaskStatus } from '~/types/task'

// トップページ（RAG requirements: タスク一覧・登録・編集の入口）
// 担当者トグルで選択中の担当者タスクのみ統計に反映

const { assignees } = useAssignees()
const selectedAssigneeId = ref('')
const tasks = ref<Task[]>([])
const loading = ref(true)

async function fetchTasks () {
  loading.value = true
  try {
    const q = selectedAssigneeId.value ? `?assigneeId=${encodeURIComponent(selectedAssigneeId.value)}` : ''
    tasks.value = await $fetch<Task[]>(`/api/tasks${q}`)
  } catch {
    tasks.value = []
  } finally {
    loading.value = false
  }
}

function countByStatus (status: TaskStatus): number {
  return tasks.value.filter((t) => t.status === status).length
}

const statCards = computed(() => [
  { label: '未対応', value: loading.value ? '…' : countByStatus('not_started'), iconBg: 'var(--status-pending)' },
  { label: '対応中', value: loading.value ? '…' : countByStatus('in_progress'), iconBg: 'var(--status-progress)' },
  { label: '完了', value: loading.value ? '…' : countByStatus('done'), iconBg: 'var(--status-done)' }
])

watch(selectedAssigneeId, fetchTasks)
onMounted(fetchTasks)
</script>

<style scoped>
.top-page {
  padding: var(--space-6);
}

.top-page__header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.top-page__header-row :deep(.header) {
  flex: 1;
  min-width: 0;
}

.top-page__assignee-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.top-page__assignee-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.assignee-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.assignee-toggle__btn {
  padding: var(--space-2) var(--space-3);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, opacity 0.3s ease;
}

.assignee-toggle__btn:hover {
  color: var(--text-primary);
  background: var(--assignee-toggle-hover-bg, rgba(0, 0, 0, 0.06));
}

.assignee-toggle__btn--active {
  color: var(--assignee-toggle-active-text, #fff);
  background: var(--accent);
  animation: assignee-btn-fade-in 0.35s ease-out;
}

@keyframes assignee-btn-fade-in {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
  }
}

.assignee-toggle__btn--active:hover {
  background: var(--accent-hover);
  color: var(--assignee-toggle-active-text, #fff);
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
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.quick-action-card:hover {
  border-color: var(--border);
  box-shadow: var(--shadow-md);
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
}

/* 統計カード: 担当者切り替え時はフェードアウト完了後に0.5sでフェードイン */
.stat-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.stat-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.stat-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stat-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
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
