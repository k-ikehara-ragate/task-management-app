#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { FrontendStack } from '../lib/frontend-stack'
import { DynamoDBStack } from '../lib/dynamodb-stack'

const app = new cdk.App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
}

new FrontendStack(app, 'FrontendStack', {
  env,
  description: 'CloudFront + S3 static site for task management frontend',
})

new DynamoDBStack(app, 'DynamoDBStack', {
  env,
  description: 'DynamoDB table for task and assignee (Phase 1)',
})
