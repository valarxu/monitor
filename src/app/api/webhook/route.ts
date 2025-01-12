import { NextResponse } from 'next/server'
import { useTransactionStore } from '@/services/transactionStore'

// 修改日志函数，使用 console.log
const logToFile = (message: string) => {
  const timestamp = new Date().toISOString()
  // 在 Vercel 中，console.log 会被记录到部署日志中
  console.log(`[${timestamp}] ${message}`)
}

export async function OPTIONS() {
  logToFile('OPTIONS request received')
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: Request) {
  try {
    logToFile('POST request received')
    logToFile(`Headers: ${JSON.stringify(Object.fromEntries(req.headers))}`)
    
    const rawBody = await req.text()
    logToFile(`Raw body: ${rawBody}`)
    
    let body
    try {
      body = JSON.parse(rawBody)
      logToFile(`Parsed body: ${JSON.stringify(body)}`)
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e))
      logToFile(`Error parsing body: ${error.message}`)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    
    if (!Array.isArray(body)) {
      logToFile('Invalid payload format - expected array')
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 })
    }

    // 处理 Helius webhook 的交易数据
    const transactions = body.map(tx => ({
      signature: tx.signature || 'unknown',
      type: tx.type || 'unknown',
      timestamp: tx.timestamp || Date.now(),
    }))

    const store = useTransactionStore.getState()
    transactions.forEach(tx => {
      store.addTransaction(tx)
      logToFile(`Transaction added: ${JSON.stringify(tx)}`)
    })
    
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    logToFile(`Error: ${err.message}`)
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    )
  }
} 