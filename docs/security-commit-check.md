# コミット前セキュリティチェック結果

RAG/reference.md およびワークスペースのセキュリティガイドラインに基づく確認。

## チェック項目（AWS・シークレット関連）

| 項目 | 結果 | 備考 |
|------|------|------|
| .env / credentials がステージングに含まれていないか | **問題なし** | .gitignore で除外。ステージング一覧に含まれていないことを確認。 |
| ハードコードされた AWS アクセスキー・シークレット | **問題なし** | ソース・ドキュメントにはプレースホルダ（AKIAxxxxxxxxxxxx）および DynamoDB Local 用の dummy 認証のみ。 |
| infra/node_modules のコミット | **要対応** | 約 4000 件以上の node_modules がステージングに含まれている。依存パッケージはコミットしないこと。 |
| infra/cdk.out のコミット | **要対応** | CDK のビルド成果物。.gitignore で cdk.out/ を除外済みだが、既に追跡されている場合はコミット対象になる。 |

## 推奨対応

1. **infra/node_modules と infra/cdk.out をコミットから外す**
   - これらはビルド成果物・依存であり、リポジトリに含めるべきではない。
   - 含めるとリポジトリが肥大化し、依存内のサンプルや設定が誤って含まれるリスクがある。

2. **上記をアンステージし、追跡から外す（実行するコマンド）**
   - 他の Git 操作（commit 画面など）を閉じてから実行する。
   ```bash
   git reset HEAD infra/node_modules infra/cdk.out
   git rm -r --cached infra/node_modules
   git rm -r --cached infra/cdk.out
   ```
   - その後、必要なソース・ドキュメントのみを改めて `git add .` してコミットする（.gitignore により node_modules と cdk.out は追加されない）。

## 結論

- **AWS の認証情報（アクセスキー・シークレット）や .env の実値はコミット対象に含まれていない。**
- **infra/node_modules と infra/cdk.out をコミットから除外してからコミットすること。**
