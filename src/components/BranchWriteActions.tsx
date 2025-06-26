import React from 'react'
import { useArtifact } from '@artifact/client/hooks'

interface Props {
  branch: string
}

const BranchWriteActions: React.FC<Props> = ({ branch }) => {
  const artifact = useArtifact()
  if (!artifact) return null
  const scoped = artifact.checkout({ branch })

  const run = async (op: string) => {
    try {
      switch (op) {
        case 'fork': {
          const path = window.prompt('fork path')
          if (!path) return
          await scoped.branch.write.fork({ path })
          break
        }
        case 'merge': {
          const other = window.prompt('merge from branch')
          if (!other) return
          const otherScope = await scoped.checkout({ branch: other }).latest()
          await scoped.branch.write.merge(otherScope.scope)
          break
        }
        case 'rm':
          await scoped.branch.write.rm()
          break
        case 'reset': {
          const commit = window.prompt('reset to commit')
          if (!commit) return
          await scoped.branch.write.reset(commit)
          break
        }
        case 'pull': {
          const remote = window.prompt('remote name') || undefined
          await scoped.branch.write.pull(remote)
          break
        }
        case 'push': {
          const remote = window.prompt('remote name') || undefined
          await scoped.branch.write.push(remote)
          break
        }
        case 'commit': {
          const message = window.prompt('commit message')
          if (!message) return
          await scoped.branch.write.commit(message)
          break
        }
      }
    } catch (e) {
      console.error(e)
      window.alert(String(e))
    }
  }

  return (
    <div className="space-y-2">
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('fork')}
      >
        Fork
      </button>
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('merge')}
      >
        Merge
      </button>
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('commit')}
      >
        Commit
      </button>
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('rm')}
      >
        Remove
      </button>
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('reset')}
      >
        Reset
      </button>
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('pull')}
      >
        Pull
      </button>
      <button
        className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
        onClick={() => run('push')}
      >
        Push
      </button>
    </div>
  )
}

export default BranchWriteActions
