/**
 * 担当者マスタ（F-08）
 * GET /api/assignees で DynamoDB の担当者一覧を取得する
 */

export interface Assignee {
  id: string
  name: string
}

export function useAssignees () {
  const { data, pending, error } = useFetch<Assignee[]>('/api/assignees', {
    default: () => [],
    key: 'assignees'
  })
  const assignees = computed(() => data.value ?? [])
  return {
    assignees,
    loading: pending,
    error
  }
}
