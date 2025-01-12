'use client'

import { useEffect } from 'react'
import { useTransactionStore } from '@/services/transactionStore'

export default function TransactionList() {
  const transactions = useTransactionStore((state) => state.transactions)
  const addTransaction = useTransactionStore((state) => state.addTransaction)

  useEffect(() => {
    // 添加测试数据
    addTransaction({
      signature: 'test-signature-123',
      type: 'TEST',
      timestamp: Date.now(),
    })
  }, [addTransaction])

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
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
    </div>
  )
} 