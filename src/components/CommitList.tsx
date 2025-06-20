import React, { useState } from 'react'
import { useBranch } from '@artifact/client/hooks'
import CommitRow from './CommitRow'

interface CommitListProps {
  selectedCommit: string | null
  onSelect: (oid: string) => void
  filter?: string
}

const INITIAL_LIMIT = 20
const LOAD_COUNT = 20

const CommitList: React.FC<CommitListProps> = ({
  selectedCommit,
  onSelect,
  filter
}) => {
  const [limit, setLimit] = useState(INITIAL_LIMIT)
  const { history } = useBranch(limit)

  const loadMore = () => setLimit((l) => l + LOAD_COUNT)

  if (!history) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-gray-100 p-3">
            <div className="animate-pulse h-6 bg-gray-100 rounded w-3/4 mb-1"></div>
            <div className="animate-pulse h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {history.map((oid) => (
        <CommitRow
          key={oid}
          oid={oid}
          selected={selectedCommit === oid}
          onSelect={onSelect}
          filter={filter}
        />
      ))}
      {history.length >= limit && (
        <button
          className="w-full py-2 text-sm text-blue-600 hover:underline"
          onClick={loadMore}
        >
          Load More
        </button>
      )}
    </div>
  )
}

export default CommitList
