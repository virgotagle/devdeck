import React from 'react'
import { X } from 'lucide-react'

interface ManifestEditorHeaderProps {
  onClose: () => void
}

export const ManifestEditorHeader: React.FC<ManifestEditorHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
      <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
        <span>Edit Project Manifest</span>
      </h2>
      <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
        <X size={20} />
      </button>
    </div>
  )
}
