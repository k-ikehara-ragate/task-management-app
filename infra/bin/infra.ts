#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { FrontendStack } from '../lib/frontend-stack'

const app = new cdk.App()
new FrontendStack(app, 'FrontendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1'
  },
  description: 'CloudFront + S3 static site for task management frontend'
})
