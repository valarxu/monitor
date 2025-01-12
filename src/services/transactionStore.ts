import { Transaction } from '@/types/types'

class TransactionManager {
  private static instance: TransactionManager
  private transactions: Transaction[] = []
  private listeners: ((transactions: Transaction[]) => void)[] = []

  private constructor() {}

  static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager()
    }
    return TransactionManager.instance
  }

  addTransactions(newTransactions: Transaction[]) {
    this.transactions = [...newTransactions, ...this.transactions].slice(0, 100) // 只保留最新的100条记录
    this.notifyListeners()
  }

  addTransaction(transaction: Transaction) {
    this.transactions = [transaction, ...this.transactions].slice(0, 100)
    this.notifyListeners()
  }

  getTransactions(): Transaction[] {
    return this.transactions
  }

  addListener(listener: (transactions: Transaction[]) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (transactions: Transaction[]) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.transactions))
  }
}

export const transactionManager = TransactionManager.getInstance()

// 客户端状态管理
import { create } from 'zustand'

interface TransactionStore {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => 
    set((state) => ({ 
      transactions: [transaction, ...state.transactions].slice(0, 100)
    })),
})) 