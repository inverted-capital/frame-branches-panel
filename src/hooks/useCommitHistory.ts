import { useArtifact } from '@artifact/client/hooks'
import { useEffect, useState } from 'react'
import type { Commit } from '../types/git'

const SHORT_HASH_LEN = 7

function toIsoDate(timestamp: number, offset: number): string {
  return new Date((timestamp + offset * 60) * 1000).toISOString()
}

export default function useCommitHistory(
  branch: string | null,
  limit = 50
): Commit[] | undefined {
  const artifact = useArtifact()
  const [commits, setCommits] = useState<Commit[]>()

  useEffect(() => {
    if (!artifact || !branch) {
      setCommits(undefined)
      return
    }

    let active = true
    const scoped = artifact.checkout({ branch })

    const load = async () => {
      try {
        const hashes = await scoped.branch.read.history(limit)
        const list: Commit[] = []
        for (const hash of hashes) {
          const commit = await scoped
            .checkout({ commit: hash })
            .branch.read.commit()
          list.push({
            id: hash,
            hash,
            shortHash: hash.slice(0, SHORT_HASH_LEN),
            message: commit.message,
            author: commit.author.name,
            date: toIsoDate(
              commit.author.timestamp,
              commit.author.timezoneOffset
            ),
            branch
          })
        }
        if (active) setCommits(list)
      } catch (e) {
        console.error(e)
        if (active) setCommits(undefined)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [artifact, branch, limit])

  return commits
}
