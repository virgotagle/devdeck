import React from 'react'
import { Save } from 'lucide-react'

interface ManifestEditorFooterProps {
  onClose: () => void
  onSave: () => void
}

export const ManifestEditorFooter: React.FC<ManifestEditorFooterProps> = ({ onClose, onSave }) => {
  return (
    <div className="p-4 border-t border-slate-800 flex justify-end space-x-3">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <Save size={16} />
        <span>Save Manifest</span>
      </button>
    </div>
  )
}
