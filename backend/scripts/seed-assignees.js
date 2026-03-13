/**
 * 担当者マスタのシード投入。DynamoDB Local 用。
 * 実行: npm run db:seed（リポジトリルート）または npm run dynamodb:seed-assignees（backend 直下）
 */

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

const endpoint =
  process.env.DYNAMODB_ENDPOINT ||
  process.env.NUXT_DYNAMODB_ENDPOINT ||
  'http://localhost:8000'
const tableName = process.env.DYNAMODB_TABLE || process.env.NUXT_DYNAMODB_TABLE || 'task-management'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  endpoint,
  credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
})

const assignees = [
  { id: 'assignee-1', name: '担当者A' },
  { id: 'assignee-2', name: '担当者B' },
  { id: 'assignee-3', name: '担当者C' },
  { id: 'assignee-4', name: '担当者D' },
]

async function main() {
  for (const a of assignees) {
    const item = {
      pk: `ASSIGNEE#${a.id}`,
      sk: 'METADATA',
      entityType: 'ASSIGNEE',
      id: a.id,
      name: a.name,
    }
    await client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: marshall(item),
      })
    )
    console.log(`Seeded assignee: ${a.name} (${a.id})`)
  }
  console.log('Seed completed.')
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  if (err.code === 'ECONNREFUSED' || err.name === 'NetworkingError') {
    console.error('DynamoDB Local が起動していない可能性があります。npm run docker:up を実行してください。')
  }
  if (err.name === 'ResourceNotFoundException') {
    console.error(`テーブル "${tableName}" がありません。先に npm run db:create-table を実行してください。`)
  }
  process.exit(1)
})
