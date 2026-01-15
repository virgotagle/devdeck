import React from 'react'
import { useEditManifestModal } from './useEditManifestModal'
import { ManifestEditorHeader } from './ManifestEditorHeader'
import { ManifestEditorBody } from './ManifestEditorBody'
import { ManifestEditorFooter } from './ManifestEditorFooter'

interface EditManifestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (manifest: string) => void
  initialManifest?: string
}

const EditManifestModal: React.FC<EditManifestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialManifest = '{}'
}) => {
  const { manifest, error, setManifest, handleSave, setError } = useEditManifestModal({
    isOpen,
    initialManifest,
    onSave,
    onClose
  })

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-[600px] pointer-events-auto flex flex-col max-h-[90vh]">
          <ManifestEditorHeader onClose={onClose} />

          <ManifestEditorBody
            manifest={manifest}
            setManifest={setManifest}
            error={error}
            setError={setError}
          />

          <ManifestEditorFooter onClose={onClose} onSave={handleSave} />
        </div>
      </div>
    </>
  )
}

export default EditManifestModal
