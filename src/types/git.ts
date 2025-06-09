export interface Commit {
  id: string
  hash: string
  shortHash: string
  message: string
  author: string
  date: string
  branch: string
  tags?: string[]
}

export interface Branch {
  name: string
  isDefault?: boolean
}
