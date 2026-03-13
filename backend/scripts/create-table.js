/**
 * DynamoDB Local 用テーブル作成。
 * infra/lib/dynamodb-stack.ts と同じ PK/SK/GSI 定義。
 * 実行: npm run db:create-table（リポジトリルート）または npm run dynamodb:create-table（backend 直下）
 * 環境変数: DYNAMODB_ENDPOINT または NUXT_DYNAMODB_ENDPOINT（未設定時は http://localhost:8000）
 */

import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb'

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

async function tableExists() {
  try {
    await client.send(
      new DescribeTableCommand({ TableName: tableName })
    )
    return true
  } catch (e) {
    if (e.name === 'ResourceNotFoundException') return false
    throw e
  }
}

async function main() {
  if (await tableExists()) {
    console.log(`Table "${tableName}" already exists. Skipping.`)
    return
  }

  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
        { AttributeName: 'gsi1pk', AttributeType: 'S' },
        { AttributeName: 'gsi1sk', AttributeType: 'S' },
        { AttributeName: 'gsi2pk', AttributeType: 'S' },
        { AttributeName: 'gsi2sk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1-assignee-due',
          KeySchema: [
            { AttributeName: 'gsi1pk', KeyType: 'HASH' },
            { AttributeName: 'gsi1sk', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
        {
          IndexName: 'gsi2-entity-due',
          KeySchema: [
            { AttributeName: 'gsi2pk', KeyType: 'HASH' },
            { AttributeName: 'gsi2sk', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
    })
  )

  console.log(`Table "${tableName}" created successfully at ${endpoint}.`)
}

main().catch((err) => {
  console.error('Create table failed:', err.message)
  if (err.code === 'ECONNREFUSED' || err.name === 'NetworkingError') {
    console.error('DynamoDB Local が起動していない可能性があります。npm run docker:up を実行してください。')
  }
  process.exit(1)
})
