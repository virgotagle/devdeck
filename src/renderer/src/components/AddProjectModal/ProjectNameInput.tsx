import React from 'react'
import { Input } from '../ui/input'

interface ProjectNameInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

const ProjectNameInput: React.FC<ProjectNameInputProps> = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-400">Project Name</label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        placeholder="My Awesome App"
        autoFocus
        required
        className="bg-slate-950"
      />
    </div>
  )
}

export default ProjectNameInput
