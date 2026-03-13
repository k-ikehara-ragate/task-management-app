/**
 * 担当者マスタ（F-08）
 * 要件: プルダウン用の担当者一覧（情シス 3〜4名）
 * RAG: composables に切り出し
 */

export interface Assignee {
  id: string
  name: string
}

const ASSIGNEES: Assignee[] = [
  { id: '1', name: '担当者A' },
  { id: '2', name: '担当者B' },
  { id: '3', name: '担当者C' },
  { id: '4', name: '担当者D' }
]

export function useAssignees (): { assignees: Assignee[] } {
  return { assignees: ASSIGNEES }
}
