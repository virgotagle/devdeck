import React from 'react'
import { Plus } from 'lucide-react'
import { Project } from '../types/project'
import ProjectCard from './ProjectCard'

interface ProjectListProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
  onAddClick: () => void
  filterLabel: string
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectClick,
  onAddClick,
  filterLabel
}) => {
  return (
    <div className="pt-24 px-6 pb-12 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-200">
          {filterLabel}
          <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            {projects.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={onProjectClick} />
        ))}

        {/* Add New Placeholder Card */}
        <button
          onClick={onAddClick}
          className="border-2 border-dashed border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all group min-h-[160px]"
        >
          <div className="p-3 bg-slate-900 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="font-medium">Add New Project</span>
        </button>
      </div>
    </div>
  )
}

export default ProjectList
