# trying-cypress

🐌🐌🐌 Cypressを試してみる！  

## 実行方法

```shell
# モジュールのインストール
yarn install

# 開発用実行
yarn dev

# ビルド
yarn build
```

Dockerを使用する場合は以下のコマンドを実行してください。  

```shell
# Dockerイメージのビルド
docker build -t trying-cypress .

# Dockerコンテナの実行
docker run --rm -d -p 80:80 --name trying-cypress trying-cypress
```
