<template>
  <div class="tasks-page">
    <AppDashboardHeader
      title="タスク一覧"
      subtitle="担当者・期日順で確認し、登録・編集ができます"
    />
    <div class="tasks-page__toolbar">
      <label class="tasks-page__filter-label" for="filter-assignee">担当者</label>
      <select
        id="filter-assignee"
        v-model="filterAssigneeId"
        class="tasks-page__filter-select"
      >
        <option value="">
          すべて
        </option>
        <option
          v-for="a in assignees"
          :key="a.id"
          :value="a.id"
        >
          {{ a.name }}
        </option>
      </select>
      <NuxtLink to="/tasks/new" class="tasks-page__btn-new">
        新規登録
      </NuxtLink>
    </div>
    <p v-if="errorMessage" class="tasks-page__error">
      {{ errorMessage }}
    </p>
    <p v-else-if="loading" class="tasks-page__loading">
      読み込み中...
    </p>
    <p v-else-if="!tasks.length" class="tasks-page__empty">
      タスクがありません。
    </p>
    <div v-else class="tasks-page__list">
      <NuxtLink
        v-for="task in tasks"
        :key="task.id"
        :to="`/tasks/${task.id}`"
        class="task-row"
      >
        <span class="task-row__title">{{ task.title }}</span>
        <span class="task-row__assignee">{{ assigneeName(task.assigneeId) }}</span>
        <span class="task-row__due">{{ task.dueDate }}</span>
        <span class="task-row__status">{{ statusLabel(task.status) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { TASK_STATUS_LABELS } from '~/types/task'

// タスク一覧（F-03, F-04, F-05）。GET /api/tasks で期日順取得、担当者フィルタはクエリで指定

const { assignees } = useAssignees()
const filterAssigneeId = ref('')
const tasks = ref<Task[]>([])
const loading = ref(true)
const errorMessage = ref('')

function assigneeName (id: string): string {
  return assignees.value.find((a) => a.id === id)?.name ?? id
}

function statusLabel (status: Task['status']): string {
  return TASK_STATUS_LABELS[status] ?? status
}

async function fetchTasks () {
  loading.value = true
  errorMessage.value = ''
  try {
    const q = filterAssigneeId.value ? `?assigneeId=${encodeURIComponent(filterAssigneeId.value)}` : ''
    tasks.value = await $fetch<Task[]>(`/api/tasks${q}`)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : '一覧の取得に失敗しました'
    tasks.value = []
  } finally {
    loading.value = false
  }
}

watch(filterAssigneeId, fetchTasks)

onMounted(fetchTasks)
</script>

<style scoped>
.tasks-page {
  padding: var(--space-6);
  min-width: 0;
}

.tasks-page__toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
}

.tasks-page__filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.tasks-page__filter-select {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  min-width: 8rem;
}

.tasks-page__btn-new {
  padding: var(--space-2) var(--space-4);
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background: var(--accent);
  border-radius: var(--radius-md);
  text-decoration: none;
  margin-left: auto;
}

.tasks-page__btn-new:hover {
  background: var(--accent-hover);
}

.tasks-page__error,
.tasks-page__loading,
.tasks-page__empty {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.tasks-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.task-row {
  display: grid;
  grid-template-columns: 1fr minmax(5rem, auto) minmax(5rem, auto) minmax(4rem, auto);
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.task-row:hover {
  background: var(--surface-elevated);
  border-color: var(--accent);
}

.task-row__title {
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-row__assignee,
.task-row__due {
  color: var(--text-secondary);
}

.task-row__status {
  font-size: 0.8125rem;
}
</style>
