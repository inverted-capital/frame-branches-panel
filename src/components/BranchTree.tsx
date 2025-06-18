import { GitBranch, ChevronRight, ChevronDown } from 'lucide-react'
import { useBranches } from '@artifact/client/hooks'
import { useState } from 'react'

interface BranchNodeProps {
  path: string
  name: string
  selected: string | null
  onSelect: (branch: string) => void
}

const BranchNode: React.FC<BranchNodeProps> = ({
  path,
  name,
  selected,
  onSelect
}) => {
  const fullPath = path ? `${path}/${name}` : name
  const children = useBranches(fullPath)
  const [expanded, setExpanded] = useState(false)
  const hasChildren = children && children.length > 0

  return (
    <div className="ml-2">
      <div
        className={`flex items-center p-1 rounded cursor-pointer ${
          selected === fullPath
            ? 'bg-blue-50 text-blue-700'
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onSelect(fullPath)}
      >
        {hasChildren && (
          <button
            className="mr-1 text-gray-500"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
        <GitBranch size={14} className="mr-1 text-gray-500" />
        <span className="text-sm">{name}</span>
      </div>
      {expanded && hasChildren && (
        <div className="ml-4">
          {children!.map((child) => (
            <BranchNode
              key={child}
              path={fullPath}
              name={child}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface BranchTreeProps {
  selected: string | null
  onSelect: (branch: string) => void
}

const BranchTree: React.FC<BranchTreeProps> = ({ selected, onSelect }) => {
  const branches = useBranches()
  if (!branches) return null
  return (
    <div className="space-y-1">
      {branches.map((name) => (
        <BranchNode
          key={name}
          path=""
          name={name}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default BranchTree
