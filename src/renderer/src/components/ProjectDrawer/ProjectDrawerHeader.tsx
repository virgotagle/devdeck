import React from 'react'
import { X, Save } from 'lucide-react'
import { Project } from '../../types/project'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'

interface ProjectDrawerHeaderProps {
  project: Project
  isEditing: boolean
  draftName: string
  setDraftName: (name: string) => void
  onSave: () => void
  onEditStart: () => void
  onEditCancel: () => void
  onClose: () => void
}

const ProjectDrawerHeader: React.FC<ProjectDrawerHeaderProps> = ({
  project,
  isEditing,
  draftName,
  setDraftName,
  onSave,
  onEditStart,
  onEditCancel,
  onClose
}) => {
  return (
    <div className="p-6 border-b border-slate-800 flex items-start justify-between">
      <div className="flex-1 min-w-0 mr-4">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-full text-lg font-bold"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button
                onClick={onSave}
                variant="default"
                size="sm"
                className="flex-1 bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-600/30"
              >
                <Save size={14} className="mr-2" />
                <span>Save</span>
              </Button>
              <Button
                onClick={onEditCancel}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="group">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100 truncate" title={project.name}>
                {project.name}
              </h2>
              <Button
                onClick={onEditStart}
                variant="link"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs h-auto py-0 text-indigo-400 hover:text-indigo-300 ml-2"
              >
                Edit
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="secondary" className="uppercase tracking-wider">
            {project.language}
          </Badge>
          <Badge
            variant="secondary"
            className="uppercase tracking-wider text-indigo-300/80 font-bold"
          >
            {project.projectType}
          </Badge>
        </div>
        <div className="text-xs text-slate-600 font-mono mt-1" title={project.path}>
          {project.path}
        </div>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="text-slate-400 hover:text-white mt-1"
      >
        <X size={24} />
      </Button>
    </div>
  )
}

export default ProjectDrawerHeader
