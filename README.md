# タスク管理アプリ

開発・実行は**リポジトリルート**から一括で行います。**Windows / Mac の両方**で同じ手順で開発できるよう、cross-env で環境をそろえています。ホストで Node と DynamoDB Local を動かす構成です。

## 前提

- Node.js 20+
- DynamoDB 利用時は **Java 17 以上**（DynamoDB Local 用）。macOS なら `brew install openjdk@17` で導入可能。JAR は `backend/.dynamodb-local` に用意する（手順は [local-development.md](docs/local-development.md) 参照）。

## ルートで使えるコマンド一覧

| コマンド | 説明 |
|----------|------|
| `npm run install:all` | ルート・frontend・backend の依存関係を一括インストール |
| `npm run db:create-table` | ローカル用 DynamoDB テーブル作成（localhost:8000） |
| `npm run db:seed` | 担当者マスタをシード |
| `npm run db:setup` | テーブル作成 + シードを一括実行（DynamoDB Local は事前に起動すること） |
| `npm run dev` | フロント＋API をホストで起動（http://localhost:3000、Windows/Mac 両対応） |
| `npm run build` | フロントをビルド |
| `npm run preview` | ビルド後のプレビュー起動 |

## 開発の流れ（起動手順）

**DynamoDB を使う場合**は、すべて**リポジトリルート**で実行する（infra ディレクトリに移動する必要はない）。  
**実際の操作手順**（Java の入れ方・ターミナルの分け方・ブラウザの開き方まで）は **[ローカル開発の進め方](docs/local-development.md)** の「**起動手順（実際の操作）**」に記載している。

| 順番 | ターミナル | 実行内容 |
|------|------------|----------|
| 1 | 任意 | （初回のみ）`npm run install:all` |
| 2 | ターミナル 1 | `npm run dynamodb:start` → 起動したらそのまま |
| 3 | ターミナル 2 | （初回のみ）`npm run db:setup` |
| 4 | ターミナル 2 | `npm run dev` |
| 5 | ブラウザ | http://localhost:3000 を開く（macOS: `open http://localhost:3000`） |

- **Java 17 以上**が必要。未導入なら macOS で `brew install openjdk@17`（または `brew install --cask temurin`）。
- JAR が無い場合は [local-development.md](docs/local-development.md) の「ステップ 3」で取得する。

## ドキュメント

- [ローカル開発の進め方](docs/local-development.md)
- [Nuxt 4 セットアップ](docs/setup-execution.md)
- [DynamoDB 実装と運用フロー](docs/dynamodb-implementation-and-flow.md)
- [develop で DynamoDB を使う](docs/develop-with-dynamodb.md)
