# タスク管理アプリ

開発・実行は**リポジトリルート**から一括で行います。**Windows / Mac の両方**で同じ手順で開発できるよう、Docker と cross-env で環境をそろえています。

## 前提

- Node.js 20+
- Docker / Docker Compose（DynamoDB 利用時）
- Windows では WSL2 利用を推奨（Docker Desktop）

## ルートで使えるコマンド一覧

| コマンド | 説明 |
|----------|------|
| `npm run install:all` | ルート・frontend・backend の依存関係を一括インストール |
| `npm run docker:up` | DynamoDB Local を起動（ポート 8000） |
| `npm run docker:down` | DynamoDB Local を停止 |
| `npm run docker:logs` | DynamoDB Local のログを表示 |
| `npm run docker:dev` | DynamoDB + フロントをコンテナで起動（Windows/Mac 同一環境） |
| `npm run db:create-table` | ローカル用 DynamoDB テーブル作成 |
| `npm run db:seed` | 担当者マスタをシード |
| `npm run db:setup` | docker:up + テーブル作成 + シードを一括実行 |
| `npm run dev` | フロント＋API をホストで起動（http://localhost:3000、Windows/Mac 両対応） |
| `npm run build` | フロントをビルド |
| `npm run preview` | ビルド後のプレビュー起動 |

## 開発の流れ

### Docker だけで環境を整える（推奨）

```bash
docker compose build
docker compose up -d
```

これだけで **DB（DynamoDB Local）・テーブル作成・シード・フロント** が起動する。ブラウザで http://localhost:3000 を開く。`npm run docker:dev` でも同様（フォアグラウンドで起動）。

### ホストで Node を動かす場合

```bash
npm run install:all
npm run db:setup    # DynamoDB Local 起動 + テーブル作成 + シード
npm run dev
```

## Docker（Windows / Mac 共通）

- **docker-compose.yml**（ルート）: **DB（dynamodb-local）・DB 初期化（db-init）・フロント（frontend-dev）** を定義。`docker compose up` で一括起動。
- **backend/Dockerfile**: DB 初期化用（テーブル作成・担当者シード）。起動後に終了し、フロントはその完了を待って起動する。
- **npm run docker:up**: DynamoDB のみ起動。ホストで `npm run dev` するとき用。
- **npm run docker:dev**: `docker compose up` と同様。DB ＋ db-init ＋ フロントを一括起動。
- **frontend/Dockerfile**: 静的ビルド＋ nginx 配信（本番プレビュー用）。
- **frontend/Dockerfile.dev**: 開発用。ソースをマウントしてコンテナ内で `npm run dev` を実行。

**作成した設定の構成・作成手順・利用手順**はすべて [Docker 開発環境（Windows/Mac 共通）](docs/docker-development.md) にまとめてある。

## ドキュメント

- [Docker 開発環境（Windows/Mac 共通）](docs/docker-development.md)
- [Nuxt 4 セットアップ](docs/setup-execution.md)
- [DynamoDB 実装と運用フロー](docs/dynamodb-implementation-and-flow.md)
- [develop で DynamoDB を使う](docs/develop-with-dynamodb.md)
