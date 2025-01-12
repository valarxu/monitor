import TransactionList from '@/components/TransactionList'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">
          Solana Transaction Monitor
        </h1>
        <TransactionList />
      </main>
    </div>
  )
}
