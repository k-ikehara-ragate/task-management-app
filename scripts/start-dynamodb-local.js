#!/usr/bin/env node
/**
 * DynamoDB Local をポート 8000 で起動する。
 * 前提: Java 17+ がインストールされていること。
 * JAR が無い場合は backend/.dynamodb-local にダウンロードしてから実行すること。
 */
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const projectRoot = path.resolve(__dirname, '..')
const dynamoDir = path.join(projectRoot, 'backend', '.dynamodb-local')
const jarPath = path.join(dynamoDir, 'DynamoDBLocal.jar')
const libPath = path.join(dynamoDir, 'DynamoDBLocal_lib')

if (!fs.existsSync(jarPath)) {
  console.error('DynamoDB Local の JAR が見つかりません。')
  console.error('以下を実行して JAR を取得してください:')
  console.error('  mkdir -p backend/.dynamodb-local && cd backend/.dynamodb-local')
  console.error('  curl -sL -o dynamodb_local_latest.tar.gz "https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz"')
  console.error('  tar -xzf dynamodb_local_latest.tar.gz')
  process.exit(1)
}

// Homebrew の OpenJDK を優先（システムの java がスタブの場合）
const brewJava =
  process.env.JAVA_HOME
    ? path.join(process.env.JAVA_HOME, 'bin', 'java')
    : null
const openjdk17 =
  fs.existsSync('/usr/local/opt/openjdk@17/bin/java') && '/usr/local/opt/openjdk@17/bin/java'
  || fs.existsSync('/opt/homebrew/opt/openjdk@17/bin/java') && '/opt/homebrew/opt/openjdk@17/bin/java'
  || null
const javaCmd = brewJava && fs.existsSync(brewJava)
  ? brewJava
  : openjdk17
  || 'java'

const child = spawn(javaCmd, [
  '-Djava.library.path=./DynamoDBLocal_lib',
  '-jar', 'DynamoDBLocal.jar',
  '-sharedDb',
  '-inMemory',
  '-port', '8000'
], {
  cwd: dynamoDir,
  stdio: 'inherit',
  shell: false,
  env: { ...process.env }
})

child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error('Java が見つかりません。Java 17 以上をインストールしてください。')
    console.error('macOS: brew install openjdk@17 または brew install --cask temurin')
    console.error('手順: docs/local-development.md を参照。')
  } else {
    console.error(err)
  }
  process.exit(1)
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
