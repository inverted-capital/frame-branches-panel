import { useArtifact, useExists, useJson } from '@artifact/client/hooks'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import type { JsonValue } from '@artifact/client/api'

const settingsSchema = z.object({
  selectedBranch: z.string().optional()
})

export interface BranchSettings {
  selectedBranch?: string
}

const useBranchSettings = () => {
  const exists = useExists('branchSettings.json')
  const raw = useJson('branchSettings.json')
  const artifact = useArtifact()
  const [data, setData] = useState<BranchSettings>({})

  useEffect(() => {
    if (raw !== undefined) {
      const parsed = settingsSchema.safeParse(raw)
      if (parsed.success) setData(parsed.data)
    }
  }, [raw])

  const update = async (newData: BranchSettings): Promise<void> => {
    setData(newData)
    if (!artifact) return
    artifact.files.write.json('branchSettings.json', newData as JsonValue)
    await artifact.branch.write.commit('Update branch settings')
  }

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'branchSettings.json not found' : null

  return { data, loading, error, update }
}

export default useBranchSettings
