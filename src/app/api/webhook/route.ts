import { NextResponse } from 'next/server'
import { useTransactionStore } from '@/services/transactionStore'
import fs from 'fs'
import path from 'path'

// 添加文件日志功能
const logToFile = (message: string) => {
  const logPath = path.join(process.cwd(), 'webhook.log')
  const timestamp = new Date().toISOString()
  const logMessage = `${timestamp}: ${message}\n`
  fs.appendFileSync(logPath, logMessage)
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
    
    if (!body || typeof body !== 'object') {
      logToFile('Invalid payload format')
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 })
    }

    const transaction = {
      signature: body.signature || body.txId || 'unknown',
      type: body.type || 'unknown',
      timestamp: body.timestamp || Date.now(),
    }
    
    const store = useTransactionStore.getState()
    store.addTransaction(transaction)
    
    logToFile(`Transaction added: ${JSON.stringify(transaction)}`)
    
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