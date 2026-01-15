import React from 'react'
import { Coffee, Cpu, Briefcase, User as UserIcon } from 'lucide-react'

import { Project } from '../types/project'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Badge } from './ui/badge'

interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card
      onClick={() => onClick(project)}
      className="cursor-pointer hover:border-indigo-500 transition-colors group"
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between mb-1">
          <div className="flex gap-2">
            <div className="p-2 rounded-md bg-slate-800 text-indigo-400 group-hover:text-indigo-300 transition-colors">
              {project.language === 'python' ? <Cpu size={20} /> : <Coffee size={20} />}
            </div>
            <div className="p-2 rounded-md bg-slate-800 text-slate-400 group-hover:text-slate-300 transition-colors">
              {project.projectType === 'Work' ? <Briefcase size={20} /> : <UserIcon size={20} />}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="font-mono text-[10px]">
              {project.language}
            </Badge>
            <Badge variant="outline" className="text-[10px] tracking-wider font-bold uppercase">
              {project.projectType}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <CardTitle className=" text-slate-100 font-medium truncate mb-3 text-base">
          {project.name}
        </CardTitle>
        <div className="text-xs text-slate-600 font-mono truncate bg-slate-950/50 p-1.5 rounded">
          {project.path}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
