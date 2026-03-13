/**
 * 担当者一覧取得（F-08）。entityType=ASSIGNEE で Scan。
 */

import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { getDynamoClient, getTableName, unmarshall } from '../utils/dynamodb'
import { itemToAssignee } from '../utils/task-mapping'

export default defineEventHandler(async (event) => {
  const client = getDynamoClient(event)
  const tableName = getTableName(event)
  const result = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: 'entityType = :type',
      ExpressionAttributeValues: {
        ':type': { S: 'ASSIGNEE' },
      },
    })
  )
  const items = (result.Items ?? []).map((item) => unmarshall(item))
  return items.map(itemToAssignee)
})
