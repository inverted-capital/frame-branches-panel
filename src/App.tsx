import React, { useState } from 'react'
import {
  Github as Git,
  GitBranch,
  GitMerge,
  GitCommit,
  GitPullRequest,
  Search,
  Scissors,
  RefreshCw,
  Check,
  X,
  Tag,
  Clock,
  Filter,
  ArrowDown,
  ArrowUp
} from 'lucide-react'
import useBranchSettings from './hooks/useBranchSettings'
import { useFrame, useArtifact } from '@artifact/client/hooks'
import type { BranchScope } from '@artifact/client/api'
import BranchTree from './components/BranchTree'
import RemotesList from './components/RemotesList'
import useCommitHistory from './hooks/useCommitHistory'

const App: React.FC = () => {
  const { data, update } = useBranchSettings()
  const frame = useFrame()
  const artifact = useArtifact()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(
    data.selectedBranch || 'main'
  )
  const [showCommitDetails, setShowCommitDetails] = useState<boolean>(false)
  const [showNewBranch, setShowNewBranch] = useState(false)
  const [showFork, setShowFork] = useState(false)
  const [branchNameInput, setBranchNameInput] = useState('')
  const [activeTab, setActiveTab] = useState<'graph' | 'branches' | 'tags'>(
    'graph'
  )

  const commits = useCommitHistory(selectedBranch)
  const filteredCommits = (commits ?? []).filter((commit) => {
    const matchesSearch =
      searchTerm === '' ||
      commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commit.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commit.shortHash.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch =
      selectedBranch === null || commit.branch === selectedBranch

    return matchesSearch && matchesBranch
  })

  const handleCommitSelect = (commitId: string) => {
    if (selectedCommit === commitId) {
      setSelectedCommit(null)
      setShowCommitDetails(false)
    } else {
      setSelectedCommit(commitId)
      setShowCommitDetails(true)
    }
  }

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName)
    update({ selectedBranch: branchName })
    frame.onSelection?.({
      ...(frame.target as BranchScope),
      branch: branchName
    })
  }

  const handleCreateBranch = async () => {
    if (!artifact) return
    const base = artifact.checkout({
      branch: selectedBranch || (frame.target as BranchScope).branch
    })
    await base.branch.write.fork({ path: branchNameInput })
    setShowNewBranch(false)
    setBranchNameInput('')
  }

  const handleForkBranch = async () => {
    if (!artifact) return
    const base = artifact.checkout({
      branch: selectedBranch || (frame.target as BranchScope).branch
    })
    await base.branch.write.fork({ path: branchNameInput })
    setShowFork(false)
    setBranchNameInput('')
  }

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

  const selectedCommitDetails = selectedCommit
    ? (commits?.find((c) => c.id === selectedCommit) ?? null)
    : null

  return (
    <div className="animate-fadeIn p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Git className="mr-2" size={24} />
        Git History
      </h1>

      <>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium">Example Repo</h2>
              <p className="text-sm text-gray-600">
                Mock repository description
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded flex items-center hover:bg-blue-100 transition-colors text-sm">
                <RefreshCw size={14} className="mr-1" />
                Fetch & Pull
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded flex items-center hover:bg-gray-200 transition-colors text-sm">
                <GitBranch size={14} className="mr-1" />
                <span>{selectedBranch}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Branches</h3>
                <div className="space-x-2">
                  <button
                    className="px-2 py-1 text-sm bg-gray-50 rounded hover:bg-gray-100"
                    onClick={() => setShowNewBranch(true)}
                  >
                    New Branch
                  </button>
                  <button
                    className="px-2 py-1 text-sm bg-gray-50 rounded hover:bg-gray-100"
                    onClick={() => setShowFork(true)}
                  >
                    Fork
                  </button>
                </div>
              </div>

              <BranchTree
                selected={selectedBranch}
                onSelect={handleBranchSelect}
              />

              <RemotesList />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                  <GitMerge size={16} className="mr-2 text-purple-600" />
                  Merge Branches
                </button>
                <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                  <Tag size={16} className="mr-2 text-green-600" />
                  Create Tag
                </button>
                <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                  <Scissors size={16} className="mr-2 text-orange-600" />
                  Cherry Pick
                </button>
                <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                  <GitPullRequest size={16} className="mr-2 text-blue-600" />
                  Create Pull Request
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'graph' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('graph')}
                >
                  Commit Graph
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'branches' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('branches')}
                >
                  Branches
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'tags' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('tags')}
                >
                  Tags
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search commits..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center text-sm transition-colors">
                      <Filter size={14} className="mr-2" />
                      Filter
                    </button>
                    <div className="border border-gray-200 rounded-md overflow-hidden flex">
                      <button
                        className="px-3 py-2 bg-white hover:bg-gray-50 text-sm flex items-center"
                        title="Older commits"
                      >
                        <ArrowDown size={14} className="mr-1" />
                        Older
                      </button>
                      <div className="border-l border-gray-200"></div>
                      <button
                        className="px-3 py-2 bg-white hover:bg-gray-50 text-sm flex items-center"
                        title="Newer commits"
                      >
                        <ArrowUp size={14} className="mr-1" />
                        Newer
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {filteredCommits.map((commit) => (
                    <div
                      key={commit.id}
                      className={`border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCommit === commit.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleCommitSelect(commit.id)}
                    >
                      <div className="flex items-start">
                        <div className="text-gray-500 mr-3 mt-1">
                          <GitCommit size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{commit.message}</div>
                          <div className="flex items-center text-sm mt-1">
                            <span className="text-blue-600 font-mono">
                              {commit.shortHash}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-600">
                              {commit.author}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {getCommitDate(commit.date)}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full mr-2">
                              {commit.branch}
                            </span>
                            {commit.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full mr-2"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCommitDetails && selectedCommitDetails && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Commit Details</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCommitDetails(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="text-xl font-medium mb-2">
                    {selectedCommitDetails.message}
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
                      {selectedCommitDetails.hash}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Author
                    </div>
                    <div>{selectedCommitDetails.author}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Date
                    </div>
                    <div>{getCommitDate(selectedCommitDetails.date)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Branch
                    </div>
                    <div className="flex items-center">
                      <GitBranch size={14} className="mr-1 text-purple-600" />
                      <span>{selectedCommitDetails.branch}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Tags
                    </div>
                    <div>
                      {selectedCommitDetails.tags &&
                      selectedCommitDetails.tags.length > 0 ? (
                        <div className="flex items-center">
                          <Tag size={14} className="mr-1 text-green-600" />
                          <span>{selectedCommitDetails.tags.join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No tags</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded flex items-center text-sm hover:bg-blue-100">
                      <GitBranch size={14} className="mr-1" />
                      Create Branch
                    </button>
                    <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded flex items-center text-sm hover:bg-purple-100">
                      <Tag size={14} className="mr-1" />
                      Create Tag
                    </button>
                    <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded flex items-center text-sm hover:bg-green-100">
                      <Check size={14} className="mr-1" />
                      Checkout
                    </button>
                    <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded flex items-center text-sm hover:bg-orange-100">
                      <Scissors size={14} className="mr-1" />
                      Cherry Pick
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <h4 className="font-medium mb-2">Changes</h4>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-64">
                    <div className="font-mono text-sm text-gray-600">
                      <div className="text-green-600">
                        + Added feature components
                      </div>
                      <div className="text-green-600">+ Updated API client</div>
                      <div className="text-red-600">- Removed legacy code</div>
                      <div className="text-gray-600"> Modified test cases</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showNewBranch && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-80">
              <h3 className="font-medium mb-2">Create Branch</h3>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
                value={branchNameInput}
                onChange={(e) => setBranchNameInput(e.target.value)}
                placeholder="Branch name"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-2 py-1 text-sm border rounded"
                  onClick={() => setShowNewBranch(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                  onClick={handleCreateBranch}
                  disabled={!branchNameInput.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {showFork && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-80">
              <h3 className="font-medium mb-2">Fork Branch</h3>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
                value={branchNameInput}
                onChange={(e) => setBranchNameInput(e.target.value)}
                placeholder="Branch name"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-2 py-1 text-sm border rounded"
                  onClick={() => setShowFork(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                  onClick={handleForkBranch}
                  disabled={!branchNameInput.trim()}
                >
                  Fork
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

export default App
