/**
 * タスク登録（F-01）。新規は status=not_started。
 */

import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { getDynamoClient, getTableName, marshall } from '../utils/dynamodb'
import { taskToItem } from '../utils/task-mapping'
import type { TaskStatus } from '~/types/task'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title: string; assigneeId: string; dueDate: string }>(event)
  if (!body?.title || !body?.assigneeId || !body?.dueDate) {
    throw createError({ statusCode: 400, statusMessage: 'title, assigneeId, dueDate required' })
  }
  const id = crypto.randomUUID()
  const task = {
    id,
    title: body.title,
    assigneeId: body.assigneeId,
    dueDate: body.dueDate,
    status: 'not_started' as TaskStatus,
  }
  const client = getDynamoClient(event)
  const tableName = getTableName(event)
  const item = taskToItem(task)
  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  )
  return { id, ...task }
})
