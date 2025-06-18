import { useRemotes } from '@artifact/client/hooks'
import React from 'react'

const RemotesList: React.FC = () => {
  const remotes = useRemotes()
  if (!remotes) return null
  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">Remotes</h4>
      <ul className="space-y-1 text-sm">
        {remotes.map((r) => (
          <li key={r.name} className="flex justify-between">
            <span>{r.name}</span>
            <span className="text-gray-500">{r.url}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RemotesList
