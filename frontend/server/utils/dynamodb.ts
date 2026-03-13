/**
 * DynamoDB クライアント取得。エンドポイントは環境変数で切り替え（ローカル=DYNAMODB_ENDPOINT、本番=未設定でデフォルト）。
 */

import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const TABLE_NAME = 'task-management'

export function getDynamoClient(event: Parameters<typeof useRuntimeConfig>[0]) {
  const config = useRuntimeConfig(event)
  const endpoint =
    (config.dynamodbEndpoint as string) ||
    process.env.NUXT_DYNAMODB_ENDPOINT ||
    process.env.DYNAMODB_ENDPOINT ||
    ''
  const region = process.env.AWS_REGION || 'ap-northeast-1'
  const isLocal =
    typeof endpoint === 'string' &&
    endpoint.length > 0 &&
    (endpoint.includes('localhost') || endpoint.includes('127.0.0.1'))
  return new DynamoDBClient({
    region,
    ...(endpoint ? { endpoint } : {}),
    ...(isLocal && {
      credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
    }),
  })
}

export function getTableName(event: Parameters<typeof useRuntimeConfig>[0]): string {
  const config = useRuntimeConfig(event)
  return (
    (config.dynamodbTable as string) ||
    process.env.NUXT_DYNAMODB_TABLE ||
    process.env.DYNAMODB_TABLE ||
    TABLE_NAME
  )
}

export {
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
  marshall,
  unmarshall,
}
