# taisei-pf-admin

# 開発環境の構築
## 事前準備
- docker環境がローカルにある事
- Node v12.16.1(下記の手順で自動インストールされる)
## コンテナの起動
1. ```git clone <リポジトリ名>``` でリポジトリをクローンする
2. cloneしたディレクトリに ```cd```する
3. 「env/development.env.js」ファイルを編集(開発環境のみ実施)
   
   API_SERVER: 'http://localhost:43000'
   
          ↓
   
   API_SERVER: 'http://ローカルIPアドレス:43000'
   
   ※ローカルIPアドレスは[ifconfig]コマンドで確認できます。
4. ```docker-compose build --no-cache``` でDcokerをビルドする
 - 必要なイメージをダウンロードしてくるので時間がかかります
 - npmのwarningが結構出そうだけど、とりあえず無視でOKです
5. ```docker-compose up``` でプロジェクトを起動する
 - ```npm install```などが走るので初回は時間がかかります

6. 初期データ投入
 - apiリポジトリのappのディレクトリにて
 ```npm run build```
 ```npm run migrate```
 を行い初期データを投入する

7. 起動の確認
 - ```ブラウザからhttp://localhost:8000/login```で表示されればOK
 - テストアカウント(責任者権限)
 - ID:testuser
 - PW:Passpass1 

8. 業務テンプレート作成
 - ブラウザでログイン後本部モードを選択する
 - 業務テンプレート → 登録 から 警備業務と清掃業務 の業務テンプレートを登録する
 - ※警備業務がID:1となるよう警備業務から先に登録し、その後清掃業務を登録する	

# 開発するにあたっって
## 各コンテナの入り方
- ```docker exec -it taisei-pf-admin_admin_1 /bin/bash``` でコンテナに入れます
## モジュールの追加について
- node パッケージなどは コンテナに入ってからコマンドを実行してください
- ```yarn add <モジュール名>```
