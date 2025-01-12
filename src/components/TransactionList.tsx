'use client'

import { useEffect } from 'react'
import { useTransactionStore } from '@/services/transactionStore'

export default function TransactionList() {
  const transactions = useTransactionStore((state) => state.transactions)
  const setTransactions = useTransactionStore((state) => state.setTransactions)
  const addTransaction = useTransactionStore((state) => state.addTransaction)

  useEffect(() => {
    const eventSource = new EventSource('/api/transactions')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (Array.isArray(data)) {
          setTransactions(data)
        } else if (data.type !== 'ping') {
          addTransaction(data)
        }
      } catch (error) {
        console.error('Error processing SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [setTransactions, addTransaction])

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <div className="text-sm text-gray-500">
          Total: {transactions.length}
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div 
              key={tx.signature}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex justify-between">
                <span className="font-mono text-sm truncate">
                  {tx.signature}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-sm">
                Type: {tx.type}
              </div>
              {tx.description && (
                <div className="mt-1 text-sm text-gray-500">
                  {tx.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 