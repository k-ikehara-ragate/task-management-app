import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
/**
 * DynamoDB 1テーブル（タスク・担当者）。詳細設計 docs/detailed-design-dynamodb.md に準拠。
 * ローカル用 CreateTable スクリプトと同じ PK/SK/GSI 定義。
 */
export declare class DynamoDBStack extends cdk.Stack {
    readonly table: dynamodb.Table;
    constructor(scope: Construct, id: string, props?: cdk.StackProps);
}
