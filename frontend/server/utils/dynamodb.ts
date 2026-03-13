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

/**
 * DynamoDB 実行エラーを HTTP エラーに変換し、ローカル開発時に案内メッセージを付与する。
 */
export function handleDynamoError(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err)
  const name = err instanceof Error ? (err as { name?: string }).name : ''
  const code = err instanceof Error ? (err as { code?: string }).code : ''

  const isLocal =
    typeof process.env.NUXT_DYNAMODB_ENDPOINT === 'string' &&
    process.env.NUXT_DYNAMODB_ENDPOINT.length > 0

  let statusCode = 500
  let statusMessage = 'DynamoDB の操作に失敗しました'

  if (name === 'ResourceNotFoundException' || message.includes('ResourceNotFoundException')) {
    statusCode = 503
    statusMessage = isLocal
      ? 'テーブルが存在しません。npm run docker:up のあと npm run db:create-table を実行してください。'
      : 'DynamoDB テーブルが存在しません。'
  } else if (
    code === 'ECONNREFUSED' ||
    name === 'NetworkingError' ||
    message.includes('ECONNREFUSED') ||
    message.includes('fetch failed')
  ) {
    statusCode = 503
    statusMessage = isLocal
      ? 'DynamoDB Local に接続できません。npm run docker:up で起動し、npm run db:create-table でテーブルを作成してください。'
      : 'DynamoDB に接続できません。'
  } else if (name === 'UnrecognizedClientException' || message.includes('credentials')) {
    statusCode = 503
    statusMessage = isLocal
      ? 'DynamoDB Local の認証設定を確認してください。'
      : 'AWS 認証情報を設定してください。'
  }

  throw createError({ statusCode, statusMessage })
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
