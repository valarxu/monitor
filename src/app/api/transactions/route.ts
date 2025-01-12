import { NextResponse } from 'next/server'
import { transactionManager } from '@/services/transactionStore'

export const runtime = 'edge'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // 发送初始数据
      const initialTransactions = transactionManager.getTransactions()
      if (initialTransactions.length > 0) {
        send(initialTransactions)
      }

      // 添加监听器以接收新的交易
      const listener = (transactions: unknown) => {
        send(transactions)
      }
      transactionManager.addListener(listener)

      // 保持连接活跃
      const interval = setInterval(() => {
        send({ type: 'ping' })
      }, 30000)

      // 清理
      return () => {
        clearInterval(interval)
        transactionManager.removeListener(listener)
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