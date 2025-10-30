# tiny-editor 协同编辑后端集成示例

本项目提供了一个 Node.js 后端服务的示例，演示如何集成 [tiny-editor](https://opentiny.github.io/tiny-editor/docs/demo/collaborative-editing) 协同编辑后端 npm 包。

## 安装依赖

1. 执行 `pnpm i @opentiny/collaborative-editor-backend` 安装协同编辑后端 npm 包。
2. 执行 `pnpm i ws` 安装 WebSocket 服务器的包（yjs 通过 WebSocket 与客户端通信）。
3. 如果您使用 TypeScript，还需要安装 `pnpm i @types/ws -D`。

## Mongo 数据库

本项目依赖 Mongo 数据库来持久化数据。如果您已有可用的 Mongo 数据库，可以跳过此节。

您可以使用 Docker 启动一个 Mongo 服务：

```bash
docker run -d --name yjs-mongodb --restart always -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  -v mongodb_data:/data/db mongo:latest
```

## 创建 env 文件

将如下内容复制到 `.env` 文件中

如果您是通过上边文档中 docker 启动的 mongo 服务则无需修改 `MONGODB` 相关的配置，否则请将 `MONGODB_URL` 修改为正确的连接地址。

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

参考 [src/index.ts](https://github.com/vaebe/tiny-editor-collaborative-editor-backend-demo/blob/main/src/index.ts) 完成 [tiny-editor](https://opentiny.github.io/tiny-editor/docs/demo/collaborative-editing) 协同编辑后端 npm 包后端的集成

完成集成后您可以通过以下命令启动服务：

```bash
pnpm run dev
```

服务启动后，您可以通过 WebSocket 连接进行协同编辑。请确保您的客户端已正确配置，以便与后端进行通信。
