# taisei_admin(Dockerを使わない場合、下記の手順でサービスを起動できる)

## Nodeバージョン
v12.16.1（事前にインストールされていること）

## 開発環境の準備

### 依存ライブラリをインストールする
プロジェクトのルートディレクトリで以下のコマンドを実行。
```bash
# ソースコードをリポジトリをクローンする
$ git clone <リポジトリ名>

# プロジェクトフォルダへ移動
$ cd [プロジェクトフォルダ]/app/

# npmパッケージインストール
$ npm install

#開発モードでnuxtを起動する
$ npm run dev

- ブラウザから localhost:8000/login　を確認

#### テストアカウント（責任者権限）
- ID : testuser
- Password : Passpass1


# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
