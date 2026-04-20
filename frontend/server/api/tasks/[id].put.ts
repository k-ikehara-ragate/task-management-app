/**
 * タスク更新（F-02, F-06）。タイトル・担当者・期日・ステータスを更新。
 */

import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { getDynamoClient, getTableName, marshall, unmarshall, handleDynamoError } from '../../utils/dynamodb'
import { taskToItem } from '../../utils/task-mapping'
import type { TaskStatus } from '~/types/task'

const STATUSES: TaskStatus[] = ['not_started', 'in_progress', 'done']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'id required' })
  }
  const body = await readBody<{
    title?: string
    assigneeId?: string
    dueDate?: string
    dueTime?: string
    status?: TaskStatus
  }>(event)
  try {
    const client = getDynamoClient(event)
    const tableName = getTableName(event)
    const existing = await client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: {
          pk: { S: `TASK#${id}` },
          sk: { S: 'METADATA' },
        },
      })
    )
    if (!existing.Item) {
      throw createError({ statusCode: 404, statusMessage: 'Task not found' })
    }
    const current = unmarshall(existing.Item)
    if (body?.status && !STATUSES.includes(body.status)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
    }
    const dueTime =
      body?.dueTime !== undefined
        ? (body.dueTime === '' ? undefined : body.dueTime)
        : current.dueTime

    const updated = {
      id,
      title: body?.title ?? current.title,
      assigneeId: body?.assigneeId ?? current.assigneeId,
      dueDate: body?.dueDate ?? current.dueDate,
      ...(dueTime !== undefined && { dueTime }),
      status: (body?.status ?? current.status) as TaskStatus,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    }
    const item = taskToItem(updated)
    await client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: marshall(item, { removeUndefinedValues: true }),
      })
    )
    return updated
  } catch (e) {
    const code = e && typeof e === 'object' && 'statusCode' in e ? (e as { statusCode: number }).statusCode : undefined
    if (code === 404 || code === 400) throw e
    handleDynamoError(e)
  }
})
