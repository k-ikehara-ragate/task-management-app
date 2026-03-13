/**
 * タスク型（要件: 担当者1名・期日・3ステータス）
 * RAG: 型定義を明示、any を避ける
 */

export type TaskStatus = 'not_started' | 'in_progress' | 'done'

export interface TaskFormInput {
  title: string
  assigneeId: string
  dueDate: string
}

export interface Task extends TaskFormInput {
  id: string
  status: TaskStatus
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: '未対応',
  in_progress: '対応中',
  done: '完了'
}
