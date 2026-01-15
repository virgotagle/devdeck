import React from 'react'
import { Button } from '../ui/button'

interface ProjectTypeSelectorProps {
  value: 'Work' | 'Personal' | null
  onChange: (value: 'Work' | 'Personal') => void
  error?: string
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1">Project Type</label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={value === 'Work' ? 'default' : 'outline'}
          onClick={() => onChange('Work')}
          className={
            value === 'Work'
              ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }
        >
          Work
        </Button>
        <Button
          type="button"
          variant={value === 'Personal' ? 'default' : 'outline'}
          onClick={() => onChange('Personal')}
          className={
            value === 'Personal'
              ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }
        >
          Personal
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default ProjectTypeSelector
