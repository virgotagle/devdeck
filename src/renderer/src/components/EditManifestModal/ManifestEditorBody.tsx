import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ManifestEditorBodyProps {
  manifest: string
  setManifest: (manifest: string) => void
  setError: (error: string | null) => void
  error: string | null
}

export const ManifestEditorBody: React.FC<ManifestEditorBodyProps> = ({
  manifest,
  setManifest,
  setError,
  error
}) => {
  return (
    <div className="p-4 flex-1 overflow-hidden flex flex-col">
      <p className="text-slate-400 text-sm mb-4">
        Enter a valid JSON string for the project manifest.
      </p>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded p-3 text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <textarea
        className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-sm text-slate-300 focus:outline-none focus:border-indigo-500 min-h-[300px]"
        value={manifest}
        onChange={(e) => {
          setManifest(e.target.value)
          setError(null)
        }}
        spellCheck={false}
        placeholder="{}"
      />
    </div>
  )
}
