import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // 发送初始数据
      if (globalThis.latestTransactions) {
        send(globalThis.latestTransactions)
      }

      // 保持连接活跃
      const interval = setInterval(() => {
        send({ type: 'ping' })
      }, 30000)

      // 清理
      return () => {
        clearInterval(interval)
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 