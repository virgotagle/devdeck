import React, { useState } from 'react'
import ProjectDrawer from './components/ProjectDrawer'
import AddProjectModal from './components/AddProjectModal'
import SettingsModal from './components/SettingsModal'
import { Project, ProjectData } from './types/project'
import { useProjects } from './hooks/useProjects'
import { useProjectFilter } from './hooks/useProjectFilter'
import Header from './components/Header'
import ProjectList from './components/ProjectList'
import LoadingOverlay from './components/ui/LoadingOverlay'

function App(): React.JSX.Element {
  const { projects, isLoading, addProject, updateProject, deleteProject, refreshProject } =
    useProjects()
  const { filter, setFilter, searchQuery, setSearchQuery, filteredProjects } =
    useProjectFilter(projects)

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [draftProject, setDraftProject] = useState<Partial<ProjectData> | null>(null)

  const handleProjectClick = (project: Project): void => {
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  const handleSelectFolder = async (): Promise<void> => {
    try {
      const result = await window.api.selectProjectFolder()
      if (!result.canceled) {
        setDraftProject({
          name: result.name,
          path: result.path,
          readme: result.readme,
          gitRemoteUrl: result.gitRemoteUrl
        })
        setIsAddModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const handleAddProject = (projectData: ProjectData): void => {
    addProject(projectData)
    setDraftProject(null)
  }

  const handleUpdateProject = (id: string, updates: Partial<ProjectData>): void => {
    updateProject(id, updates)
    if (selectedProject?.id === id) {
      setSelectedProject({ ...selectedProject, ...updates })
    }
  }

  const handleDeleteProject = (id: string): void => {
    deleteProject(id)
    setIsDrawerOpen(false)
    setSelectedProject(null)
  }

  const handleRefreshProject = async (id: string, path: string): Promise<void> => {
    await refreshProject(id, path)
    // Find updated project and update selected state
    // useProjects reloads from DB, so the 'projects' array will change.
    // We update the local selectedProject so the drawer reflects changes immediately.
  }

  const filterLabel =
    filter === 'all'
      ? 'All Projects'
      : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Projects`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Header
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddProject={handleSelectFolder}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content */}
      <main>
        <ProjectList
          projects={filteredProjects}
          onProjectClick={handleProjectClick}
          onAddClick={handleSelectFolder}
          filterLabel={filterLabel}
        />
      </main>

      {/* Drawers & Modals */}
      <ProjectDrawer
        key={selectedProject?.id}
        project={selectedProject}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
        onRefresh={handleRefreshProject}
      />

      {isAddModalOpen && (
        <AddProjectModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setDraftProject(null)
          }}
          onAdd={handleAddProject}
          initialName={draftProject?.name}
          initialPath={draftProject?.path}
          initialReadme={draftProject?.readme}
          initialGitRemoteUrl={draftProject?.gitRemoteUrl}
        />
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <LoadingOverlay isVisible={isLoading} message="Synchronizing data..." />
    </div>
  )
}

export default App
