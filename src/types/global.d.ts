import type { Transaction } from './types'

declare global {
  // eslint-disable-next-line no-var
  var latestTransactions: Transaction[] | undefined
}

export {} 