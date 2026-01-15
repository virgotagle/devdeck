import React from 'react'
import { Button } from '../ui/button'

interface LanguageSelectorProps {
  value: 'python' | 'javascript' | null
  onChange: (value: 'python' | 'javascript') => void
  error?: string
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">Language</label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={value === 'python' ? 'default' : 'outline'}
          onClick={() => onChange('python')}
          className={
            value === 'python'
              ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }
        >
          Python
        </Button>
        <Button
          type="button"
          variant={value === 'javascript' ? 'default' : 'outline'}
          onClick={() => onChange('javascript')}
          className={
            value === 'javascript'
              ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }
        >
          JavaScript
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default LanguageSelector
