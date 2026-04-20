# develop ブランチで DynamoDB を使う手順

develop ブランチでもタスクの登録・一覧・編集を DynamoDB に保存して利用できます。開発はホストで Node と DynamoDB Local を動かす構成です。手順の詳細は [local-development.md](./local-development.md) を参照してください。

**すべてのコマンドはリポジトリルートで実行します。**

1. **依存関係のインストール**（初回のみ）
   ```bash
   npm run install:all
   ```

2. **DynamoDB Local を起動**（ポート 8000）
   - ホストで Java を使って起動する。例（メモリモード）:
     ```bash
     java -jar DynamoDBLocal.jar -sharedDb -inMemory -port 8000
     ```
   - JAR の入手方法は [AWS DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) を参照。

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

- **DynamoDB Local が起動していない**: ポート 8000 で DynamoDB Local を起動していることを確認する。
- **テーブルが存在しない**: `npm run db:create-table` を実行してテーブルを作成する。続けて `npm run db:seed` で担当者データを投入する。
- **フロントの起動方法**: 必ずリポジトリルートから `npm run dev` で起動する（`npm run dev --prefix frontend` のみだと環境変数 `NUXT_DYNAMODB_ENDPOINT` が渡らず本番 AWS に接続しようとして失敗する）。

- **開発の進め方**: [local-development.md](./local-development.md)
- **DynamoDB テーブル設計・運用**: [dynamodb-implementation-and-flow.md](./dynamodb-implementation-and-flow.md)
