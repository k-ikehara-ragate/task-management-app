<template>
  <div class="calendar-page">
    <AppDashboardHeader
      title="カレンダー"
      subtitle="タスクを日付・時間で確認できます"
    />
    <p v-if="errorMessage" class="calendar-page__error">
      {{ errorMessage }}
    </p>
    <p v-else-if="loading" class="calendar-page__loading">
      読み込み中...
    </p>
    <AppTaskCalendar
      v-else
      :tasks="tasks"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'

const tasks = ref<Task[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function fetchTasks () {
  loading.value = true
  errorMessage.value = ''
  try {
    tasks.value = await $fetch<Task[]>('/api/tasks')
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'タスクの取得に失敗しました'
    tasks.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)
</script>

<style scoped>
.calendar-page {
  padding: var(--space-6);
  min-width: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.calendar-page__error,
.calendar-page__loading {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}
</style>
