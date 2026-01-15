import React from 'react'
import Modal from '../Modal'
import ProjectNameInput from './ProjectNameInput'
import ProjectPathInput from './ProjectPathInput'
import LanguageSelector from './LanguageSelector'
import ProjectTypeSelector from './ProjectTypeSelector'
import { ProjectData } from '../../types/project'
import { useAddProjectModal } from './useAddProjectModal'
import { Button } from '../ui/button'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (project: ProjectData) => void
  initialName?: string
  initialPath?: string
  initialReadme?: string
  initialGitRemoteUrl?: string
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialName = '',
  initialPath = '',
  initialReadme,
  initialGitRemoteUrl
}) => {
  const {
    name,
    setName,
    path,
    setPath,
    language,
    setLanguage,
    projectType,
    setProjectType,
    errors,
    handleSubmit
  } = useAddProjectModal({
    onAdd,
    onClose,
    initialName,
    initialPath,
    initialReadme,
    initialGitRemoteUrl
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Project">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <ProjectNameInput value={name} onChange={setName} error={errors.name} />

        <ProjectPathInput value={path} onChange={setPath} error={errors.path} />

        <LanguageSelector value={language} onChange={setLanguage} error={errors.language} />

        <ProjectTypeSelector
          value={projectType}
          onChange={setProjectType}
          error={errors.projectType}
        />

        <div className="pt-2">
          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddProjectModal
