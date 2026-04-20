<template>
  <div class="calendar">
    <header class="calendar__toolbar">
      <div class="calendar__nav">
        <button
          type="button"
          class="calendar__btn calendar__btn--icon"
          aria-label="前の週"
          @click="goPrevWeek"
        >
          <span class="calendar__chevron" aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          class="calendar__btn calendar__btn--today"
          @click="goToday"
        >
          今日
        </button>
        <button
          type="button"
          class="calendar__btn calendar__btn--icon"
          aria-label="次の週"
          @click="goNextWeek"
        >
          <span class="calendar__chevron" aria-hidden="true">›</span>
        </button>
      </div>
      <div class="calendar__title-row">
        <select
          v-model.number="selectedYear"
          class="calendar__title-select"
          aria-label="年を選択"
          @change="goToSelectedYearMonth"
        >
          <option
            v-for="y in yearOptions"
            :key="y"
            :value="y"
          >
            {{ y }}年
          </option>
        </select>
        <select
          v-model.number="selectedMonth"
          class="calendar__title-select"
          aria-label="月を選択"
          @change="goToSelectedYearMonth"
        >
          <option
            v-for="m in 12"
            :key="m"
            :value="m"
          >
            {{ m }}月
          </option>
        </select>
      </div>
      <div class="calendar__toolbar-spacer" />
    </header>

    <div class="calendar__grid-wrap">
      <div class="calendar__grid">
        <!-- ヘッダー: 時間列 + 曜日 -->
        <div class="calendar__cell calendar__cell--head calendar__cell--time-label">
        </div>
        <div
          v-for="day in weekRange.days"
          :key="day.date"
          class="calendar__cell calendar__cell--head calendar__cell--day"
          :class="{ 'calendar__cell--today': day.isToday }"
        >
          <span class="calendar__weekday">{{ weekdayLabels[day.dayOfWeek] }}</span>
          <span class="calendar__date-num" :class="{ 'calendar__date-num--today': day.isToday }">{{ day.dayOfMonth }}</span>
        </div>

        <!-- 時間スロット行: dueTime があるタスクを該当時刻に表示 -->
        <template v-for="hour in CALENDAR_HOURS" :key="hour">
          <div class="calendar__cell calendar__cell--time-label">
            <span class="calendar__time-slot">{{ hour }}:00</span>
          </div>
          <div
            v-for="day in weekRange.days"
            :key="`${day.date}-${hour}`"
            class="calendar__cell calendar__cell--body calendar__cell--day-tasks calendar__cell--slot"
            :class="{ 'calendar__cell--today': day.isToday }"
          >
            <NuxtLink
              v-for="task in getTasksForDayHour(day.date, hour)"
              :key="task.id"
              :to="`/tasks/${task.id}`"
              class="calendar__event calendar__event--timed"
              :class="`calendar__event--${task.status}`"
            >
              <span class="calendar__event-time">{{ task.dueTime }}</span>
              <span class="calendar__event-title">{{ task.title }}</span>
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import {
  getWeekStart,
  getWeekRange,
  CALENDAR_HOURS,
  type WeekRange,
} from '~/composables/useTaskCalendar'

const props = withDefaults(
  defineProps<{
    tasks: Task[]
    initialWeekStart?: Date
  }>(),
  { initialWeekStart: undefined }
)

const weekStart = ref<Date>(
  props.initialWeekStart
    ? getWeekStart(new Date(props.initialWeekStart))
    : getWeekStart(new Date())
)

const weekRange = computed<WeekRange>(() => getWeekRange(weekStart.value))

const selectedYear = ref(weekStart.value.getFullYear())
const selectedMonth = ref(weekStart.value.getMonth() + 1)

watch(weekStart, (start) => {
  selectedYear.value = start.getFullYear()
  selectedMonth.value = start.getMonth() + 1
}, { immediate: true })

const now = new Date()
const yearOptions = Array.from(
  { length: 11 },
  (_, i) => now.getFullYear() - 2 + i
)

function goToSelectedYearMonth () {
  weekStart.value = getWeekStart(new Date(selectedYear.value, selectedMonth.value - 1, 7))
}

const weekdayLabels: Record<number, string> = {
  1: '月',
  2: '火',
  3: '水',
  4: '木',
  5: '金',
  6: '土',
  0: '日',
}

/** 指定日・指定時のタスク（dueTime の時が一致するもの） */
function getTasksForDayHour (date: string, hour: number): Task[] {
  return props.tasks.filter((t) => {
    if (t.dueDate !== date || !t.dueTime) return false
    const h = parseInt(t.dueTime.slice(0, 2), 10)
    return h === hour
  })
}

function goPrevWeek () {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() - 7)
  weekStart.value = getWeekStart(d)
}

function goNextWeek () {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + 7)
  weekStart.value = getWeekStart(d)
}

function goToday () {
  weekStart.value = getWeekStart(new Date())
}
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.calendar__toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}

.calendar__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.calendar__btn {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.calendar__btn:hover {
  background: var(--surface-elevated);
  border-color: var(--border);
}

.calendar__btn--icon {
  padding: var(--space-2) var(--space-3);
  font-size: 1.25rem;
  line-height: 1;
}

.calendar__btn--today {
  min-width: 4rem;
}

.calendar__chevron {
  display: inline-block;
  font-weight: 400;
}

.calendar__title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.calendar__title-select {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.01em;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-2);
  cursor: pointer;
  appearance: auto;
  min-width: 4.5rem;
}

.calendar__title-select:hover {
  background: var(--surface-elevated);
  border-color: var(--border);
}

.calendar__title-select:focus {
  outline: none;
  border-color: var(--accent);
}

.calendar__toolbar-spacer {
  flex: 1;
}

.calendar__grid-wrap {
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  min-height: 360px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.calendar__grid {
  display: grid;
  grid-template-columns: 4.5rem repeat(7, minmax(0, 1fr));
  grid-auto-rows: auto;
  min-width: 640px;
}

.calendar__cell {
  border-right: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  min-height: 2rem;
  padding: var(--space-1) var(--space-2);
}

.calendar__cell:last-child {
  border-right: none;
}

.calendar__cell--head {
  background: var(--surface-elevated);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: var(--space-2);
}

.calendar__cell--head.calendar__cell--day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.calendar__cell--today {
  background: var(--accent-bg-subtle);
}

.calendar__cell--time-label {
  color: var(--text-muted);
  font-size: 0.6875rem;
  font-weight: 500;
  text-align: right;
  vertical-align: top;
  padding-top: var(--space-2);
}

.calendar__weekday {
  font-size: 0.6875rem;
}

.calendar__date-num {
  font-size: 1.125rem;
  color: var(--text-primary);
}

.calendar__date-num--today {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
}

.calendar__time-slot {
  display: block;
}

.calendar__cell--day-tasks {
  vertical-align: top;
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-height: 3rem;
}

.calendar__cell--slot {
  min-height: 2.5rem;
}

.calendar__event {
  display: block;
  padding: var(--space-1) var(--space-2);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--status-pending);
  background: var(--surface-elevated);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.calendar__event:hover {
  background: var(--accent-bg-subtle);
  border-left-color: var(--accent);
}

.calendar__event--not_started {
  border-left-color: var(--status-pending);
}

.calendar__event--in_progress {
  border-left-color: var(--status-progress);
}

.calendar__event--done {
  border-left-color: var(--status-done);
  opacity: 0.85;
}

.calendar__event-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar__event--timed .calendar__event-time {
  display: block;
  font-size: 0.625rem;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.calendar__event--timed .calendar__event-title {
  font-size: 0.7rem;
}
</style>
