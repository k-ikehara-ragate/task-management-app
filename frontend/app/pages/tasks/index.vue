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
      <div class="task-row task-row--header">
        <span class="task-row__header-cell">タイトル</span>
        <span class="task-row__header-cell">担当者</span>
        <span class="task-row__header-cell">期日</span>
        <span class="task-row__header-cell">時刻</span>
        <span class="task-row__header-cell">ステータス</span>
      </div>
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-row"
      >
        <NuxtLink
          :to="`/tasks/${task.id}`"
          class="task-row__title-link"
        >
          {{ task.title }}
        </NuxtLink>
        <div class="task-row__assignee" @click.stop>
          <select
            :value="task.assigneeId"
            class="task-row__select"
            :disabled="savingId === task.id"
            @change="onAssigneeChange(task, ($event.target as HTMLSelectElement).value)"
          >
            <option
              v-for="a in assignees"
              :key="a.id"
              :value="a.id"
            >
              {{ a.name }}
            </option>
          </select>
        </div>
        <div class="task-row__due" @click.stop>
          <input
            :value="task.dueDate"
            type="date"
            class="task-row__input"
            :disabled="savingId === task.id"
            @change="onDueChange(task, ($event.target as HTMLInputElement).value)"
          >
        </div>
        <div class="task-row__due-time" @click.stop>
          <input
            :value="task.dueTime ?? ''"
            type="time"
            class="task-row__input"
            :disabled="savingId === task.id"
            step="300"
            @change="onDueTimeChange(task, ($event.target as HTMLInputElement).value)"
          >
        </div>
        <div class="task-row__status-wrap" @click.stop>
          <select
            :value="task.status"
            class="task-row__select task-row__status"
            :class="`task-row__status--${task.status}`"
            :disabled="savingId === task.id"
            @change="onStatusChange(task, ($event.target as HTMLSelectElement).value as Task['status'])"
          >
            <option
              v-for="(label, value) in TASK_STATUS_LABELS"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { TASK_STATUS_LABELS } from '~/types/task'

// タスク一覧（F-03, F-04, F-05）。タイトルクリックで編集ページ、担当者・期日・ステータスは行内トグルで更新

const { assignees } = useAssignees()
const filterAssigneeId = ref('')
const tasks = ref<Task[]>([])
const loading = ref(true)
const errorMessage = ref('')
const savingId = ref<string | null>(null)

async function fetchTasks () {
  loading.value = true
  errorMessage.value = ''
  try {
    const q = filterAssigneeId.value ? `?assigneeId=${encodeURIComponent(filterAssigneeId.value)}` : ''
    tasks.value = await $fetch<Task[]>(`/api/tasks${q}`)
  } catch (e) {
    const err = e as { data?: { message?: string; statusMessage?: string }; message?: string }
    errorMessage.value = err?.data?.message ?? err?.data?.statusMessage ?? (e instanceof Error ? e.message : '一覧の取得に失敗しました')
    tasks.value = []
  } finally {
    loading.value = false
  }
}

async function updateTask (task: Task, payload: { assigneeId?: string; dueDate?: string; dueTime?: string; status?: Task['status'] }) {
  savingId.value = task.id
  try {
    const updated = await $fetch<Task>(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: payload,
    })
    const i = tasks.value.findIndex((t) => t.id === task.id)
    if (i !== -1) tasks.value[i] = { ...tasks.value[i], ...updated }
  } catch {
    errorMessage.value = '更新に失敗しました'
  } finally {
    savingId.value = null
  }
}

function onAssigneeChange (task: Task, assigneeId: string) {
  if (assigneeId === task.assigneeId) return
  updateTask(task, { assigneeId })
}

function onDueChange (task: Task, dueDate: string) {
  if (dueDate === task.dueDate) return
  updateTask(task, { dueDate })
}

function onDueTimeChange (task: Task, dueTime: string) {
  const value = dueTime.trim() || undefined
  if (value === (task.dueTime ?? undefined)) return
  updateTask(task, { dueTime: value })
}

function onStatusChange (task: Task, status: Task['status']) {
  if (status === task.status) return
  updateTask(task, { status })
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
  overflow: visible;
}

.task-row {
  display: grid;
  grid-template-columns: 1fr 7rem 7rem 7rem 7rem;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  transition: background 0.15s ease, border-color 0.15s ease;
  overflow: visible;
}

.task-row--header {
  background: var(--surface-elevated);
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.task-row__header-cell {
  padding: var(--space-2) var(--space-3);
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}

.task-row__title-link {
  font-weight: 500;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition: background 0.15s ease, color 0.15s ease;
  box-sizing: border-box;
}

.task-row__title-link:hover {
  color: #fff;
  background: var(--accent);
}

.task-row__assignee,
.task-row__due,
.task-row__due-time,
.task-row__status-wrap {
  display: flex;
  align-items: center;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

.task-row__select,
.task-row__input {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: 0.8125rem;
  color: var(--text-primary);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}

.task-row__select:focus,
.task-row__input:focus {
  outline: none;
  border-color: var(--accent);
  z-index: 1;
}

/* ネイティブの日付・時刻ピッカーが切れないようにし、ダークテーマで白で統一 */
.task-row__due,
.task-row__due-time {
  overflow: visible;
}

.task-row__input {
  min-height: 2.25rem;
}

.theme-dark .task-row__input {
  color: #fff;
  background: var(--surface-elevated);
}

.theme-dark .task-row__input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
  opacity: 0.9;
}

.theme-dark .task-row__input::-webkit-datetime-edit {
  color: #fff;
}

.task-row__select:disabled,
.task-row__input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.task-row__status {
  font-weight: 500;
}

.task-row__status--not_started {
  color: var(--status-pending);
  border-color: var(--status-pending);
  background: var(--surface-elevated);
  background: color-mix(in srgb, var(--status-pending) 14%, var(--surface-elevated));
}

.task-row__status--in_progress {
  color: var(--status-progress);
  border-color: var(--status-progress);
  background: var(--surface-elevated);
  background: color-mix(in srgb, var(--status-progress) 14%, var(--surface-elevated));
}

.task-row__status--done {
  color: var(--status-done);
  border-color: var(--status-done);
  background: var(--surface-elevated);
  background: color-mix(in srgb, var(--status-done) 14%, var(--surface-elevated));
}
</style>
