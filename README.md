# tiny-editor 协同编辑后端集成示例

假设你有一个 nodejs 后端服务，可参考该项目完成 [tiny-editor](https://opentiny.github.io/tiny-editor/docs/demo/collaborative-editing) 协同编辑后端 npm 包后端的集成

## 安装依赖

+ 执行 `pnpm i @vaebe/collaborative-editor-backend` 安装协同编辑后端 npm 包
+ 执行 `pnpm i ws` 安装 创建 websockt 服务器的包 (yjs 通过 websokert 与客户端通信)
+ 如果您使用 ts 则还需要安装 `pnpm i @types/ws -D`

## mongo 数据库

+ 项目依赖 mongo 数据库持久化数据，如果您已有可以使用的 mongo 数据库可跳过此节。
+ 使用 docker 启动一个 mongo 服务

  ```bash
  docker run -d --name yjs-mongodb --restart always -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin \
    -v mongodb_data:/data/db mongo:latest
  ```

## 创建 env 文件

+ 将如下内容复制到 `.env` 文件中，如果您是通过上边文档中 docker 启动的 mongo 服务则无需修改 `MONGODB` 相关的配置，否则请将 `MONGODB_URL` 。

  ```bash
  HOST=0.0.0.0
  PORT=1234

  # mongo 数据库连接信息
  MONGODB_URL=mongodb://admin:admin@127.0.0.1:27017/?authSource=admin
  MONGODB_DB=tinyeditor
  MONGODB_COLLECTION=documents

  GC=true
  ```

## 集成

+ 参考 [src/index.ts](https://github.com/vaebe/tiny-editor-collaborative-editor-backend-demo/blob/main/src/index.ts) 完成 [tiny-editor](https://opentiny.github.io/tiny-editor/docs/demo/collaborative-editing) 协同编辑后端 npm 包后端的集成
