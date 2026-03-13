import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'

/**
 * DynamoDB 1テーブル（タスク・担当者）。詳細設計 docs/detailed-design-dynamodb.md に準拠。
 * ローカル用 CreateTable スクリプトと同じ PK/SK/GSI 定義。
 */
export class DynamoDBStack extends cdk.Stack {
  public readonly table: dynamodb.Table

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.table = new dynamodb.Table(this, 'TaskManagementTable', {
      tableName: 'task-management',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    this.table.addGlobalSecondaryIndex({
      indexName: 'gsi1-assignee-due',
      partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    })

    this.table.addGlobalSecondaryIndex({
      indexName: 'gsi2-entity-due',
      partitionKey: { name: 'gsi2pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'gsi2sk', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    })

    new cdk.CfnOutput(this, 'TableName', {
      value: this.table.tableName,
      description: 'DynamoDB table name for task-management API',
      exportName: 'TaskManagementTableName',
    })

    new cdk.CfnOutput(this, 'TableArn', {
      value: this.table.tableArn,
      description: 'DynamoDB table ARN (for IAM)',
      exportName: 'TaskManagementTableArn',
    })
  }
}
