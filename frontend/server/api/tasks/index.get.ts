/**
 * タスク一覧取得（F-03, F-04, F-05）。担当者指定時は GSI1、未指定時は GSI2 で期日順。
 */

import { QueryCommand } from '@aws-sdk/client-dynamodb'
import { getDynamoClient, getTableName, unmarshall } from '../../utils/dynamodb'
import { itemToTask } from '../../utils/task-mapping'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const assigneeId = query.assigneeId as string | undefined
  const client = getDynamoClient(event)
  const tableName = getTableName(event)

  if (assigneeId) {
    const result = await client.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: 'gsi1-assignee-due',
        KeyConditionExpression: 'gsi1pk = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: assigneeId },
        },
        ScanIndexForward: true,
      })
    )
    const items = (result.Items ?? []).map((item) => unmarshall(item))
    return items.map(itemToTask)
  }

  const result = await client.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: 'gsi2-entity-due',
      KeyConditionExpression: 'gsi2pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: 'ENTITY#TASK' },
      },
      ScanIndexForward: true,
    })
  )
  const items = (result.Items ?? []).map((item) => unmarshall(item))
  return items.map(itemToTask)
})
