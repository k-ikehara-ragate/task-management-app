/**
 * DynamoDB アイテムと Task / Assignee の相互変換。詳細設計 docs/detailed-design-dynamodb.md に準拠。
 */

import type { Task, TaskStatus } from '~/types/task'

export interface AssigneeRecord {
  id: string
  name: string
}

export interface TaskRecord {
  pk: string
  sk: string
  entityType: string
  id: string
  title: string
  assigneeId: string
  dueDate: string
  /** 期日時刻（HH:mm）。省略可 */
  dueTime?: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
  gsi1pk: string
  gsi1sk: string
  gsi2pk: string
  gsi2sk: string
}

export function itemToTask(item: Record<string, unknown>): Task {
  return {
    id: item.id as string,
    title: item.title as string,
    assigneeId: item.assigneeId as string,
    dueDate: item.dueDate as string,
    ...(item.dueTime != null && item.dueTime !== '' && { dueTime: item.dueTime as string }),
    status: item.status as TaskStatus,
    ...(item.createdAt && { createdAt: item.createdAt as string }),
    ...(item.updatedAt && { updatedAt: item.updatedAt as string }),
  }
}

export function itemToAssignee(item: Record<string, unknown>): AssigneeRecord {
  return {
    id: item.id as string,
    name: item.name as string,
  }
}

const ENTITY_TASK = 'ENTITY#TASK'

export function taskToItem(task: {
  id: string
  title: string
  assigneeId: string
  dueDate: string
  dueTime?: string
  status: TaskStatus
  createdAt?: string
  updatedAt?: string
}): TaskRecord {
  const now = new Date().toISOString()
  const createdAt = task.createdAt ?? now
  const updatedAt = task.updatedAt ?? now
  const dueSort = `${task.dueDate}#${task.id}`
  const record: TaskRecord = {
    pk: `TASK#${task.id}`,
    sk: 'METADATA',
    entityType: 'TASK',
    id: task.id,
    title: task.title,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate,
    status: task.status,
    createdAt,
    updatedAt,
    gsi1pk: task.assigneeId,
    gsi1sk: dueSort,
    gsi2pk: ENTITY_TASK,
    gsi2sk: dueSort,
  }
  if (task.dueTime != null && task.dueTime !== '') {
    record.dueTime = task.dueTime
  }
  return record
}
