import React, { useState } from 'react'
import {
  Github as Git,
  GitBranch,
  Search,
  RefreshCw,
  X,
  Filter,
  ArrowDown,
  ArrowUp
} from 'lucide-react'
import { useFrame } from '@artifact/client/hooks'
import type { BranchScope } from '@artifact/client/api'
import BranchTree from './components/BranchTree'
import CommitList from './components/CommitList'
import CommitDiff from './components/CommitDiff'
import BranchWriteActions from './components/BranchWriteActions'
import { useCommit } from '@artifact/client/hooks'
import { EMPTY_COMMIT } from '@artifact/client/api'
import useViewport from './hooks/useViewport'

const App: React.FC = () => {
  const frame = useFrame()
  const viewport = useViewport()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>('main')
  const [showCommitDetails, setShowCommitDetails] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'graph' | 'tags'>('graph')

  const handleCommitSelect = (commitId: string) => {
    if (selectedCommit === commitId) {
      setSelectedCommit(null)
      setShowCommitDetails(false)
    } else {
      setSelectedCommit(commitId)
      setShowCommitDetails(true)
    }
    frame.onSelection?.({
      ...(frame.target as BranchScope),
      branch: selectedBranch ?? (frame.target as BranchScope).branch,
      commit: commitId
    })
  }

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName)
    frame.onSelection?.({
      ...(frame.target as BranchScope),
      branch: branchName
    })
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

  const selectedCommitDetails = useCommit(selectedCommit ?? EMPTY_COMMIT)

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
              <h2 className="text-lg font-medium">
                {(frame.target as BranchScope).repo}
              </h2>
              <p className="text-sm text-gray-600">
                branch: {(frame.target as BranchScope).branch}
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
              </div>

              <BranchTree
                selected={selectedBranch}
                onSelect={handleBranchSelect}
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <BranchWriteActions branch={selectedBranch ?? 'main'} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'graph' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('graph')}
                >
                  Commit Graph
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
                  <CommitList
                    selectedCommit={selectedCommit}
                    onSelect={handleCommitSelect}
                    filter={searchTerm}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCommitDetails && selectedCommit && (
          <div
            style={{
              position: 'absolute',
              top: viewport.scrollY,
              left: viewport.scrollX,
              width: viewport.width,
              height: viewport.height
            }}
            className="bg-black/20 flex items-center justify-center z-50"
          >
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
                {selectedCommitDetails ? (
                  <>
                    <div className="mb-4">
                      <div className="text-xl font-medium mb-2">
                        {selectedCommitDetails.message}
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
                          {selectedCommit}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Author
                        </div>
                        <div>{selectedCommitDetails.author.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Date
                        </div>
                        <div>
                          {getCommitDate(
                            new Date(
                              (selectedCommitDetails.author.timestamp +
                                selectedCommitDetails.author.timezoneOffset *
                                  60) *
                                1000
                            ).toISOString()
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <h4 className="font-medium mb-2">Changes</h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-64">
                        <CommitDiff oid={selectedCommit} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse h-4 bg-gray-100 rounded mb-2"
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

export default App
