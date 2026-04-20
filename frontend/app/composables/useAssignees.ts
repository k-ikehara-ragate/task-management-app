/**
 * 担当者マスタ（F-08）
 * GET /api/assignees で取得。API が使えない場合は固定リストにフォールバック。
 */

export interface Assignee {
  id: string
  name: string
}

const ASSIGNEES_FALLBACK: Assignee[] = [
  { id: '1', name: '担当者A' },
  { id: '2', name: '担当者B' },
  { id: '3', name: '担当者C' },
  { id: '4', name: '担当者D' },
]

/** 担当者を名前順（A→B→C→D）でソート */
function sortAssigneesByName (list: Assignee[]): Assignee[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ja'))
}

export function useAssignees () {
  const { data, pending } = useFetch<Assignee[]>('/api/assignees', {
    key: 'assignees',
    default: () => ASSIGNEES_FALLBACK,
  })
  const assignees = computed(() => sortAssigneesByName(data.value ?? ASSIGNEES_FALLBACK))
  return {
    assignees,
    loading: pending,
  }
}
