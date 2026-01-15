import React, { useState } from 'react'
import { Terminal, Code2, FileJson, Rocket, RefreshCw } from 'lucide-react'
import { Project, ProjectData } from '../../types/project'
import EditManifestModal from '../EditManifestModal'
import { Button } from '../ui/button'

interface ProjectDrawerActionsProps {
  project: Project
  onUpdate: (id: string, updates: Partial<ProjectData>) => void
  onRefresh: () => Promise<void>
  isRefreshing: boolean
}

const ProjectDrawerActions: React.FC<ProjectDrawerActionsProps> = ({
  project,
  onUpdate,
  onRefresh,
  isRefreshing
}) => {
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false)

  const handleUpdateManifest = (manifest: string): void => {
    onUpdate(project.id, { projectManifest: manifest })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => window.api.openInAntigravity(project.path)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md h-auto py-3 justify-center"
        >
          <Rocket size={18} className="mr-2" />
          <span>Open in Ant</span>
        </Button>
        <Button
          onClick={() => window.api.openInVsCode(project.path)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white h-auto py-3 justify-center"
        >
          <Code2 size={18} className="mr-2" />
          <span>Open in VS Code</span>
        </Button>
        <Button
          onClick={() => window.api.openInTerminal(project.path)}
          variant="secondary"
          className="border border-slate-700 h-auto py-3 justify-center"
        >
          <Terminal size={18} className="mr-2" />
          <span>Terminal</span>
        </Button>
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="secondary"
          className="border border-slate-700 h-auto py-3 justify-center"
        >
          <RefreshCw size={18} className="mr-2" />
          <span>Refresh Data</span>
        </Button>
        <Button
          onClick={() => setIsManifestModalOpen(true)}
          variant="secondary"
          className="border border-slate-700 h-auto py-3 justify-center col-span-2"
        >
          <FileJson size={18} className="mr-2" />
          <span>Update Project Manifest</span>
        </Button>
      </div>

      <EditManifestModal
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
        onSave={handleUpdateManifest}
        initialManifest={project.projectManifest}
      />
    </>
  )
}

export default ProjectDrawerActions
