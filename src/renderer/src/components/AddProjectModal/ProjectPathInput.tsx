import React from 'react'
import { Input } from '../ui/input'

interface ProjectPathInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

const ProjectPathInput: React.FC<ProjectPathInputProps> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-400">File Path</label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        placeholder="/User/projects/app"
        required
        className="bg-slate-950 font-mono text-sm"
      />
    </div>
  )
}

export default ProjectPathInput
