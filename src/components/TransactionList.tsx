'use client'

import { useTransactionStore } from '@/services/transactionStore'
import { useEffect } from 'react'

export default function TransactionList() {
  const transactions = useTransactionStore((state) => state.transactions)

  useEffect(() => {
    console.log('Transactions updated:', transactions)
  }, [transactions])

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 