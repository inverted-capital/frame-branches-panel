import React from 'react'
import { GitCommit, Clock } from 'lucide-react'
import { useCommit } from '@artifact/client/hooks'

interface CommitRowProps {
  oid: string
  selected: boolean
  onSelect: (oid: string) => void
  filter?: string
}

const SHORT_HASH_LEN = 7

function toIsoDate(timestamp: number, offset: number): string {
  return new Date((timestamp + offset * 60) * 1000).toISOString()
}

const CommitRow: React.FC<CommitRowProps> = ({
  oid,
  selected,
  onSelect,
  filter
}) => {
  const commit = useCommit(oid)

  if (!commit) {
    return (
      <div className="border-b border-gray-100 p-3">
        <div className="animate-pulse h-6 bg-gray-100 rounded w-3/4 mb-1"></div>
        <div className="animate-pulse h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
    )
  }

  const shortHash = oid.slice(0, SHORT_HASH_LEN)

  const getCommitDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const date = toIsoDate(commit.author.timestamp, commit.author.timezoneOffset)

  if (
    filter &&
    !commit.message.toLowerCase().includes(filter.toLowerCase()) &&
    !commit.author.name.toLowerCase().includes(filter.toLowerCase()) &&
    !shortHash.toLowerCase().includes(filter.toLowerCase())
  ) {
    return null
  }

  return (
    <div
      className={`border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selected ? 'bg-blue-50' : ''}`}
      onClick={() => onSelect(oid)}
    >
      <div className="flex items-start">
        <div className="text-gray-500 mr-3 mt-1">
          <GitCommit size={16} />
        </div>
        <div className="flex-1">
          <div className="font-medium">{commit.message}</div>
          <div className="flex items-center text-sm mt-1">
            <span className="text-blue-600 font-mono">{shortHash}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">{commit.author.name}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              {getCommitDate(date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommitRow
