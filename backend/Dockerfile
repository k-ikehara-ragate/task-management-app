# DB 初期化用（テーブル作成・シード）。docker compose の db-init サービスで使用。
# 起動後 create-table → seed を実行して終了する。
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY scripts ./scripts
ENV DYNAMODB_TABLE=task-management
ENTRYPOINT ["sh", "-c", "node scripts/create-table.js && node scripts/seed-assignees.js"]
