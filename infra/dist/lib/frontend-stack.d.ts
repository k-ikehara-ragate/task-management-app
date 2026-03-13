import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
/**
 * CloudFront + S3 静的サイト用スタック。
 * 管理コンソールから S3 にビルド成果物をアップロードして配信する。
 * BucketDeployment は使用しない（手動アップロード前提）。
 */
export declare class FrontendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps);
}
