import { NextResponse } from 'next/server'
import { useTransactionStore } from '@/services/transactionStore'

export async function POST(req: Request) {
  try {
    console.log('Webhook received - headers:', Object.fromEntries(req.headers))
    
    const body = await req.json()
    console.log('Webhook body:', JSON.stringify(body, null, 2))
    
    const transaction = {
      signature: body.signature || body.txId,
      type: body.type,
      timestamp: body.timestamp || Date.now(),
    }
    
    const store = useTransactionStore.getState()
    store.addTransaction(transaction)
    
    console.log('Transaction added to store:', transaction)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 