/**
 * DynamoDB クライアント取得。エンドポイントは環境変数で切り替え（ローカル=DYNAMODB_ENDPOINT、本番=未設定でデフォルト）。
 */

import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const TABLE_NAME = 'task-management'

/** ランタイム設定から DynamoDB エンドポイント文字列を取得する（未設定時は空文字） */
export function getDynamoEndpoint(event: Parameters<typeof useRuntimeConfig>[0]): string {
  const config = useRuntimeConfig(event)
  return (
    (config.dynamodbEndpoint as string) ||
    process.env.NUXT_DYNAMODB_ENDPOINT ||
    process.env.DYNAMODB_ENDPOINT ||
    ''
  )
}

/**
 * DynamoDB が利用可能か（エンドポイントまたは本番用の接続先が設定されているか）。
 * 未設定の場合はビルド時プリレンダーや静的配信時であり、API は空データを返すべき。
 */
export function isDynamoConfigured(event: Parameters<typeof useRuntimeConfig>[0]): boolean {
  const endpoint = getDynamoEndpoint(event)
  return typeof endpoint === 'string' && endpoint.length > 0
}

export function getDynamoClient(event: Parameters<typeof useRuntimeConfig>[0]) {
  const endpoint = getDynamoEndpoint(event)
  const region = process.env.AWS_REGION || 'ap-northeast-1'
  const isLocalEndpoint =
    typeof endpoint === 'string' &&
    endpoint.length > 0 &&
    (endpoint.includes('localhost') ||
      endpoint.includes('127.0.0.1') ||
      endpoint.includes('dynamodb-local'))
  return new DynamoDBClient({
    region,
    ...(endpoint ? { endpoint } : {}),
    ...(isLocalEndpoint && {
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

  const isResourceNotFound =
    name === 'ResourceNotFoundException' ||
    code === 'ResourceNotFoundException' ||
    message.includes('ResourceNotFoundException')
  if (isResourceNotFound) {
    statusCode = 503
    statusMessage = isLocal
      ? 'テーブルが存在しません。DynamoDB Local 起動後に npm run db:create-table を実行してください。'
      : 'DynamoDB テーブルが存在しません。'
  } else if (
    code === 'ECONNREFUSED' ||
    name === 'NetworkingError' ||
    message.includes('ECONNREFUSED') ||
    message.includes('fetch failed')
  ) {
    statusCode = 503
    statusMessage = isLocal
      ? 'DynamoDB Local に接続できません。ポート 8000 で起動しているか確認し、npm run db:create-table でテーブルを作成してください。'
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
  marshall,
  unmarshall,
}
