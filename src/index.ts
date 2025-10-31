import http from 'node:http'
import { WebSocketServer } from 'ws'
import {
  HOST,
  PORT,
  setPersistence,
  MongoPersistence,
  setupWSConnection,
} from '@opentiny/tiny-editor-collaborative-editing-backend'
import pc from "picocolors"

const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

const wss = new WebSocketServer({ server })

// 为了避免单个连接的异常导致整个进程崩溃，把 setupWSConnection 包在 try/catch 中。
// setupWSConnection 负责处理该连接的整个生命周期（消息、同步、断线等）。
wss.on('connection', (ws, req) => {
  try {
    setupWSConnection(ws, req)
  } catch (err) {
    console.error('Failed to set up WebSocket connection:', err)
    // 尝试关闭该 ws 连接，忽略可能的关闭错误
    try {
      ws.close()
    } catch (_) {
      /* ignore */
    }
  }
})

// 将 persistence 实例注册到库中，以便库的其他部分可以访问同一实例。
const persistence = new MongoPersistence()
setPersistence(persistence)

// 只有当持久层可用时才开始监听，这样可以确保接入的客户端能完成持久化操作。
persistence
  .connect()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(pc.green(`Server running on http://${HOST}:${PORT}`))
    })
  })
  .catch((error) => {
    // 关键依赖不可用时，应让进程以失败状态退出，而不是处于不完整可用状态。
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  })

// 尝试关闭 persistence 和 HTTP server，然后退出进程。将该逻辑封装成函数以便复用。
async function shutdown(exitCode = 0) {
  console.warn('Shutting down server...')
  try {
    // 关闭持久层连接（若实现了 close）
    await persistence.close()

    // 关闭 HTTP server，停止接收新连接，并等待现有连接完成。
    server.close(() => {
      console.warn('HTTP server closed')
      process.exit(exitCode)
    })

    // 防止 server.close 回调无限期不执行：设置一个强制超时
    setTimeout(() => {
      console.warn('Forcing shutdown')
      process.exit(exitCode)
    }, 5000).unref()
  } catch (err) {
    console.error('Error during shutdown:', err)
    process.exit(1)
  }
}

// 常见停止信号
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

// 捕获未处理的 promise 拒绝与未捕获异常，尝试优雅关机后退出
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  shutdown(1)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  shutdown(1)
})
