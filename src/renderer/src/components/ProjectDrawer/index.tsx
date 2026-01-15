import React from 'react'
import { Project, ProjectData } from '../../types/project'
import ProjectDrawerHeader from './ProjectDrawerHeader'
import ProjectDrawerActions from './ProjectDrawerActions'
import ProjectDrawerReadme from './ProjectDrawerReadme'
import ProjectDrawerFooter from './ProjectDrawerFooter'
import { useProjectDrawer } from './useProjectDrawer'

interface ProjectDrawerProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, updates: Partial<ProjectData>) => void
  onDelete: (id: string) => void
  onRefresh: (id: string, path: string) => Promise<void>
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onRefresh
}) => {
  const {
    isEditing,
    draftName,
    setDraftName,
    startEditing,
    cancelEditing,
    saveChanges,
    deleteProject
  } = useProjectDrawer(project, onUpdate, onDelete, onClose)

  if (!isOpen || !project) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[50%] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <ProjectDrawerHeader
          project={project}
          isEditing={isEditing}
          draftName={draftName}
          setDraftName={setDraftName}
          onSave={saveChanges}
          onEditStart={startEditing}
          onEditCancel={cancelEditing}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <ProjectDrawerActions
            project={project}
            onUpdate={onUpdate}
            onRefresh={() => onRefresh(project.id, project.path)}
            isRefreshing={false}
          />

          {/* Additional Info / Stats Placeholder */}

          <ProjectDrawerReadme readme={project.readme} />
        </div>

        <ProjectDrawerFooter project={project} onDelete={deleteProject} />
      </div>
    </>
  )
}

export default ProjectDrawer
