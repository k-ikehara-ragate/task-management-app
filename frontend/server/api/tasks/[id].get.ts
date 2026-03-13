/**
 * タスク 1 件取得（F-02 編集用）。
 */

import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { getDynamoClient, getTableName, unmarshall } from '../../utils/dynamodb'
import { itemToTask } from '../../utils/task-mapping'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'id required' })
  }
  const client = getDynamoClient(event)
  const tableName = getTableName(event)
  const result = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: {
        pk: { S: `TASK#${id}` },
        sk: { S: 'METADATA' },
      },
    })
  )
  if (!result.Item) {
    throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  }
  return itemToTask(unmarshall(result.Item))
})
