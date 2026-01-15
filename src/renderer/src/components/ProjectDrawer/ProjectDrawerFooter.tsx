import React from 'react'
import { ExternalLink, GitBranch, Trash2 } from 'lucide-react'
import { Project } from '../../types/project'
import { Button } from '../ui/button'

interface ProjectDrawerFooterProps {
  project: Project
  onDelete: () => void
}

const ProjectDrawerFooter: React.FC<ProjectDrawerFooterProps> = ({ project, onDelete }) => {
  return (
    <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.api.openDirectory(project.path)}
          className="text-slate-500 hover:text-slate-300"
        >
          <ExternalLink size={16} className="mr-2" />
          <span>Open Directory</span>
        </Button>

        {project.gitRemoteUrl && (
          <a
            href={project.gitRemoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-300 text-sm transition-colors px-3 py-2 rounded-md hover:bg-slate-800"
            title={project.gitRemoteUrl}
          >
            <GitBranch size={16} />
            <span>View Repository</span>
          </a>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
      >
        <Trash2 size={16} className="mr-2" />
        <span>Delete Project</span>
      </Button>
    </div>
  )
}

export default ProjectDrawerFooter
