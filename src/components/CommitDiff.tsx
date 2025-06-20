import React from 'react'
import { ArtifactSyncer } from '@artifact/client/react'
import { useCommit, useFileDiff } from '@artifact/client/hooks'
import { EMPTY_COMMIT } from '@artifact/client/api'

interface CommitDiffProps {
  oid: string
}

const CommitDiff: React.FC<CommitDiffProps> = ({ oid }) => (
  <ArtifactSyncer commit={oid}>
    <InnerDiff oid={oid} />
  </ArtifactSyncer>
)

const InnerDiff: React.FC<CommitDiffProps> = ({ oid }) => {
  const commit = useCommit(oid)
  const parent = commit?.parent?.[0] ?? EMPTY_COMMIT
  const diff = useFileDiff({ other: parent })

  if (!diff) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-4 bg-gray-100 rounded mb-1"
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className="font-mono text-sm text-gray-600">
      {diff.added.map((m) => (
        <div key={m.path} className="text-green-600">
          + {m.path}
        </div>
      ))}
      {diff.removed.map((m) => (
        <div key={m.path} className="text-red-600">
          - {m.path}
        </div>
      ))}
      {diff.modified.map((m) => (
        <div key={m.path} className="text-gray-600">
          {' '}
          {m.path}
        </div>
      ))}
    </div>
  )
}

export default CommitDiff
