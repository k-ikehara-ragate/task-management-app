#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const frontend_stack_1 = require("../lib/frontend-stack");
const dynamodb_stack_1 = require("../lib/dynamodb-stack");
const app = new cdk.App();
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-northeast-1',
};
new frontend_stack_1.FrontendStack(app, 'FrontendStack', {
    env,
    description: 'CloudFront + S3 static site for task management frontend',
});
new dynamodb_stack_1.DynamoDBStack(app, 'DynamoDBStack', {
    env,
    description: 'DynamoDB table for task and assignee (Phase 1)',
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9iaW4vaW5mcmEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBb0M7QUFDcEMsaURBQWtDO0FBQ2xDLDBEQUFxRDtBQUNyRCwwREFBcUQ7QUFFckQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDekIsTUFBTSxHQUFHLEdBQUc7SUFDVixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7SUFDeEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksZ0JBQWdCO0NBQzNELENBQUE7QUFFRCxJQUFJLDhCQUFhLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUN0QyxHQUFHO0lBQ0gsV0FBVyxFQUFFLDBEQUEwRDtDQUN4RSxDQUFDLENBQUE7QUFFRixJQUFJLDhCQUFhLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUN0QyxHQUFHO0lBQ0gsV0FBVyxFQUFFLGdEQUFnRDtDQUM5RCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlcidcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCB7IEZyb250ZW5kU3RhY2sgfSBmcm9tICcuLi9saWIvZnJvbnRlbmQtc3RhY2snXG5pbXBvcnQgeyBEeW5hbW9EQlN0YWNrIH0gZnJvbSAnLi4vbGliL2R5bmFtb2RiLXN0YWNrJ1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpXG5jb25zdCBlbnYgPSB7XG4gIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OID8/ICdhcC1ub3J0aGVhc3QtMScsXG59XG5cbm5ldyBGcm9udGVuZFN0YWNrKGFwcCwgJ0Zyb250ZW5kU3RhY2snLCB7XG4gIGVudixcbiAgZGVzY3JpcHRpb246ICdDbG91ZEZyb250ICsgUzMgc3RhdGljIHNpdGUgZm9yIHRhc2sgbWFuYWdlbWVudCBmcm9udGVuZCcsXG59KVxuXG5uZXcgRHluYW1vREJTdGFjayhhcHAsICdEeW5hbW9EQlN0YWNrJywge1xuICBlbnYsXG4gIGRlc2NyaXB0aW9uOiAnRHluYW1vREIgdGFibGUgZm9yIHRhc2sgYW5kIGFzc2lnbmVlIChQaGFzZSAxKScsXG59KVxuIl19