# develop ブランチで DynamoDB を使う手順

develop ブランチでもタスクの登録・一覧・編集を DynamoDB に保存して利用できます。

**Docker だけで環境を整える場合**: リポジトリルートで `docker compose build` → `docker compose up -d`（または `npm run docker:dev`）を実行するだけで、DB・テーブル作成・シード・フロントが一括で起動する。**DynamoDB のデータは名前付きボリュームで永続化されるため、Docker を終了してもテーブルとデータは残り、どの OS（Windows/Mac/Linux）でも同じ構成で同じデータが利用できる。** 詳細は [docker-development.md](./docker-development.md) を参照。

**ホストで Node を動かす場合**（以下、すべてリポジトリルートで実行）:

1. **依存関係のインストール**（初回のみ）
   ```bash
   npm run install:all
   ```

2. **DynamoDB Local を起動**
   ```bash
   npm run docker:up
   ```

3. **テーブル作成とシード**（初回のみ）
   ```bash
   npm run db:create-table
   npm run db:seed
   ```
   または一括で: `npm run db:setup`

4. **フロントを起動**
   ```bash
   npm run dev
   ```
   ブラウザで http://localhost:3000 を開く。

### タスク一覧で「500 Server Error」や「DynamoDB に接続できません」と表示される場合

- **DynamoDB Local が起動していない**: リポジトリルートで `npm run docker:up` を実行し、ポート 8000 で起動していることを確認する。
- **テーブルが存在しない**: `npm run db:create-table` を実行してテーブルを作成する。続けて `npm run db:seed` で担当者データを投入する。
- **フロントの起動方法**: 必ずリポジトリルートから `npm run dev` で起動する（`npm run dev --prefix frontend` のみだと環境変数 `NUXT_DYNAMODB_ENDPOINT` が渡らず本番 AWS に接続しようとして失敗する）。

- **Docker の設定・作成手順・利用方法**: [docker-development.md](./docker-development.md) に一括で記載。
- **DynamoDB テーブル設計・運用**: [dynamodb-implementation-and-flow.md](./dynamodb-implementation-and-flow.md) を参照。
