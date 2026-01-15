import { useState } from 'react'

interface UseEditManifestModalProps {
  isOpen: boolean
  initialManifest?: string
  onSave: (manifest: string) => void
  onClose: () => void
}

interface UseEditManifestModalReturn {
  manifest: string
  error: string | null
  setManifest: (manifest: string) => void
  handleSave: () => void
  setError: (error: string | null) => void
}

const formatJson = (json: string): string => {
  try {
    if (!json) return '{}'
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return json
  }
}

export const useEditManifestModal = ({
  isOpen,
  initialManifest = '{}',
  onSave,
  onClose
}: UseEditManifestModalProps): UseEditManifestModalReturn => {
  const [manifest, setManifest] = useState(() => formatJson(initialManifest))
  const [error, setError] = useState<string | null>(null)

  // State for tracking previous props to enable derived state reset
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevInitialManifest, setPrevInitialManifest] = useState(initialManifest)

  if (isOpen !== prevIsOpen || (isOpen && initialManifest !== prevInitialManifest)) {
    setPrevIsOpen(isOpen)
    setPrevInitialManifest(initialManifest)
    if (isOpen) {
      setManifest(formatJson(initialManifest || '{}'))
      setError(null)
    }
  }

  const handleSave = (): void => {
    try {
      // Validate JSON
      JSON.parse(manifest)
      onSave(manifest)
      onClose()
    } catch {
      setError('Invalid JSON format')
    }
  }

  return {
    manifest,
    error,
    setManifest,
    handleSave,
    setError
  }
}
