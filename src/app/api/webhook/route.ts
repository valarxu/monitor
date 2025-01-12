import { NextResponse } from 'next/server'
import type { Transaction } from '@/types/types'

const logTo = (message: string) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
}

export async function OPTIONS() {
  logTo('OPTIONS request received')
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
    logTo('POST request received')
    logTo(`Headers: ${JSON.stringify(Object.fromEntries(req.headers))}`)
    
    const rawBody = await req.text()
    logTo(`Raw body: ${rawBody}`)
    
    let body
    try {
      body = JSON.parse(rawBody)
      logTo(`Parsed body: ${JSON.stringify(body)}`)
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e))
      logTo(`Error parsing body: ${error.message}`)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    
    if (!Array.isArray(body)) {
      logTo('Invalid payload format - expected array')
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 })
    }

    // 处理 Helius webhook 的交易数据
    const transactions: Transaction[] = body.map(tx => ({
      signature: tx.signature,
      type: tx.type,
      timestamp: tx.timestamp,
      description: tx.description
    }))

    // 存储交易数据到全局变量中
    globalThis.latestTransactions = transactions

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    logTo(`Error: ${err.message}`)
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    )
  }
} 