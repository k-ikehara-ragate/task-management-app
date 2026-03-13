<template>
  <div class="task-new-page">
    <AppDashboardHeader
      title="新規タスク登録"
      subtitle="タイトル・担当者・期日を入力して登録します（初期ステータス: 未対応）"
    />
    <form class="task-form" @submit.prevent="onSubmit">
      <div class="task-form__field">
        <label class="task-form__label" for="task-title">タイトル</label>
        <input
          id="task-title"
          v-model="form.title"
          type="text"
          class="task-form__input"
          required
          placeholder="タスクのタイトルを入力"
          autocomplete="off"
        />
      </div>
      <div class="task-form__field">
        <label class="task-form__label" for="task-assignee">担当者</label>
        <select
          id="task-assignee"
          v-model="form.assigneeId"
          class="task-form__select"
          required
        >
          <option value="" disabled>
            選択してください
          </option>
          <option
            v-for="a in assignees"
            :key="a.id"
            :value="a.id"
          >
            {{ a.name }}
          </option>
        </select>
      </div>
      <div class="task-form__field">
        <label class="task-form__label" for="task-due">期日</label>
        <input
          id="task-due"
          v-model="form.dueDate"
          type="date"
          class="task-form__input"
          required
        />
      </div>
      <p class="task-form__note">
        初期ステータスは「未対応」で登録されます。
      </p>
      <div class="task-form__actions">
        <button type="submit" class="task-form__btn task-form__btn--primary">
          登録
        </button>
        <NuxtLink to="/tasks" class="task-form__btn task-form__btn--secondary">
          キャンセル
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskFormInput } from '~/types/task'

// 要件: タイトル・担当者・期日・初期ステータス（未対応）、登録・キャンセル
// RAG: Composition API、型付け

const { assignees } = useAssignees()
const router = useRouter()

const form = reactive<TaskFormInput>({
  title: '',
  assigneeId: '',
  dueDate: ''
})

function onSubmit () {
  const task: Task = {
    id: crypto.randomUUID(),
    title: form.title.trim(),
    assigneeId: form.assigneeId,
    dueDate: form.dueDate,
    status: 'not_started'
  }
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem('tasks') : null
  const list: Task[] = raw ? (JSON.parse(raw) as Task[]) : []
  list.push(task)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('tasks', JSON.stringify(list))
  }
  router.push('/tasks')
}
</script>

<style scoped>
.task-new-page {
  padding: var(--space-6);
}

.task-form {
  max-width: 28rem;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.task-form__field {
  margin-bottom: var(--space-5);
}

.task-form__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.task-form__input,
.task-form__select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease;
}

.task-form__input::placeholder {
  color: var(--text-muted);
}

.task-form__input:focus,
.task-form__select:focus {
  outline: none;
  border-color: var(--accent);
}

.task-form__select {
  cursor: pointer;
  appearance: auto;
}

.task-form__note {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-5);
}

.task-form__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.task-form__btn {
  padding: var(--space-3) var(--space-5);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.15s ease;
  border: none;
}

.task-form__btn--primary {
  background: var(--accent);
  color: #fff;
}

.task-form__btn--primary:hover {
  background: var(--accent-hover);
}

.task-form__btn--secondary {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.task-form__btn--secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
