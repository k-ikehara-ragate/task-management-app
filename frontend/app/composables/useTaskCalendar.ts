/**
 * カレンダー表示用の週・日付計算
 * 日本時間の週開始を月曜とする（ISO 週の月曜開始に合わせる）
 */

export interface CalendarDay {
  date: string
  dayOfMonth: number
  dayOfWeek: number
  isToday: boolean
  isCurrentMonth: boolean
}

export interface WeekRange {
  start: Date
  end: Date
  days: CalendarDay[]
  label: string
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** 日付を YYYY-MM-DD に正規化 */
export function toDateString (d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 指定日が属する週の月曜 00:00 を返す */
export function getWeekStart (date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** 週の日付リスト（月〜日）を生成 */
export function getWeekDays (weekStart: Date): CalendarDay[] {
  const today = toDateString(new Date())
  const days: CalendarDay[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    const dateStr = toDateString(d)
    days.push({
      date: dateStr,
      dayOfMonth: d.getDate(),
      dayOfWeek: d.getDay(),
      isToday: dateStr === today,
      isCurrentMonth: true,
    })
  }
  return days
}

/** 週の範囲とラベルを取得 */
export function getWeekRange (weekStart: Date): WeekRange {
  const days = getWeekDays(weekStart)
  const end = new Date(weekStart)
  end.setDate(weekStart.getDate() + 6)
  const startMonth = weekStart.getMonth()
  const endMonth = end.getMonth()
  const startYear = weekStart.getFullYear()
  const endYear = end.getFullYear()
  let label: string
  if (startYear !== endYear) {
    label = `${startYear}年${startMonth + 1}月 - ${endYear}年${endMonth + 1}月`
  } else if (startMonth !== endMonth) {
    label = `${startYear}年${startMonth + 1}月 - ${endMonth + 1}月`
  } else {
    label = `${startYear}年${startMonth + 1}月`
  }
  return {
    start: weekStart,
    end,
    days,
    label,
  }
}

/** 時間スロット（0:00〜23:00、1時間刻み） */
export const CALENDAR_HOURS = Array.from({ length: 24 }, (_, i) => i)
