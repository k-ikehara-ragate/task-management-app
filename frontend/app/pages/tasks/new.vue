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
      <div class="task-form__field">
        <label class="task-form__label" for="task-due-time">時刻</label>
        <input
          id="task-due-time"
          v-model="form.dueTime"
          type="time"
          class="task-form__input"
          step="300"
        />
        <span class="task-form__hint">省略時は終日として登録されます</span>
      </div>
      <p class="task-form__note">
        初期ステータスは「未対応」で登録されます。
      </p>
      <p v-if="errorMessage" class="task-form__error">
        {{ errorMessage }}
      </p>
      <div class="task-form__actions">
        <button
          type="submit"
          class="task-form__btn task-form__btn--primary"
          :disabled="pending"
        >
          {{ pending ? '登録中...' : '登録' }}
        </button>
        <NuxtLink to="/tasks" class="task-form__btn task-form__btn--secondary">
          キャンセル
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { TaskFormInput } from '~/types/task'

// 要件: タイトル・担当者・期日・初期ステータス（未対応）、登録・キャンセル（F-01）
// 登録は POST /api/tasks で DynamoDB に保存し、成功後に一覧へ遷移

const { assignees } = useAssignees()
const router = useRouter()
const pending = ref(false)
const errorMessage = ref('')

const form = reactive<TaskFormInput>({
  title: '',
  assigneeId: '',
  dueDate: '',
  dueTime: undefined
})

async function onSubmit () {
  pending.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        title: form.title.trim(),
        assigneeId: form.assigneeId,
        dueDate: form.dueDate,
        ...(form.dueTime && { dueTime: form.dueTime })
      }
    })
    await router.push('/tasks')
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : '登録に失敗しました'
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.task-new-page {
  padding: var(--space-6);
}

.task-form {
  box-sizing: border-box;
  max-width: min(28rem, 100%);
  width: 100%;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.task-form__field {
  box-sizing: border-box;
  min-width: 0;
  margin-bottom: var(--space-5);
}

.task-form__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.task-form__hint {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.task-form__input,
.task-form__select {
  box-sizing: border-box;
  display: block;
  width: 100%;
  max-width: 100%;
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
