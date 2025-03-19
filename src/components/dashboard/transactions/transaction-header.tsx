import Link from 'next/link';

export function TransactionHeader() {
    return (
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Recent transactions</h2>
        <Link href="/transaction" className="text-purple-500 hover:text-purple-400">
          view all
        </Link>
      </div>
    )
  }
  
  