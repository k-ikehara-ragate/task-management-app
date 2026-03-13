<template>
  <div class="task-edit-page">
    <AppDashboardHeader
      title="タスク編集"
      subtitle="タイトル・担当者・期日・ステータスを変更して保存します"
    />
    <p v-if="notFound" class="task-edit-page__error">
      タスクが見つかりません。
    </p>
    <p v-else-if="loadError" class="task-edit-page__error">
      {{ loadError }}
    </p>
    <p v-else-if="loading" class="task-edit-page__loading">
      読み込み中...
    </p>
    <form v-else class="task-form" @submit.prevent="onSubmit">
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
      <div class="task-form__field">
        <label class="task-form__label" for="task-status">ステータス</label>
        <select
          id="task-status"
          v-model="form.status"
          class="task-form__select"
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
      <p v-if="errorMessage" class="task-form__error">
        {{ errorMessage }}
      </p>
      <div class="task-form__actions">
        <button
          type="submit"
          class="task-form__btn task-form__btn--primary"
          :disabled="pending"
        >
          {{ pending ? '保存中...' : '保存' }}
        </button>
        <NuxtLink to="/tasks" class="task-form__btn task-form__btn--secondary">
          キャンセル
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskFormInput, TaskStatus } from '~/types/task'
import { TASK_STATUS_LABELS } from '~/types/task'

// タスク編集（F-02, F-06）。GET /api/tasks/:id で取得、PUT /api/tasks/:id で更新

const route = useRoute()
const router = useRouter()
const { assignees } = useAssignees()

const taskId = computed(() => route.params.id as string)
const loading = ref(true)
const notFound = ref(false)
const loadError = ref('')
const pending = ref(false)
const errorMessage = ref('')

const form = reactive<TaskFormInput & { status: TaskStatus }>({
  title: '',
  assigneeId: '',
  dueDate: '',
  status: 'not_started'
})

async function loadTask () {
  if (!taskId.value) {
    notFound.value = true
    loading.value = false
    return
  }
  loading.value = true
  loadError.value = ''
  notFound.value = false
  try {
    const task = await $fetch<Task>(`/api/tasks/${taskId.value}`)
    form.title = task.title
    form.assigneeId = task.assigneeId
    form.dueDate = task.dueDate
    form.status = task.status
  } catch (e: unknown) {
    const err = e as { statusCode?: number }
    if (err?.statusCode === 404) {
      notFound.value = true
    } else {
      loadError.value = e instanceof Error ? e.message : '取得に失敗しました'
    }
  } finally {
    loading.value = false
  }
}

async function onSubmit () {
  pending.value = true
  errorMessage.value = ''
  try {
    await $fetch(`/api/tasks/${taskId.value}`, {
      method: 'PUT',
      body: {
        title: form.title.trim(),
        assigneeId: form.assigneeId,
        dueDate: form.dueDate,
        status: form.status
      }
    })
    await router.push('/tasks')
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : '保存に失敗しました'
  } finally {
    pending.value = false
  }
}

onMounted(loadTask)
</script>

<style scoped>
.task-edit-page {
  padding: var(--space-6);
  min-width: 0;
}

.task-edit-page__error,
.task-edit-page__loading {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0 0 var(--space-5);
}

.task-edit-page__error {
  color: var(--status-error, #b91c1c);
}

.task-form {
  max-width: min(28rem, 100%);
  width: 100%;
  box-sizing: border-box;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.task-form__field {
  margin-bottom: var(--space-5);
  min-width: 0;
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
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: var(--space-3) var(--space-4);
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s ease;
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

.task-form__error {
  font-size: 0.875rem;
  color: var(--status-error, #b91c1c);
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
