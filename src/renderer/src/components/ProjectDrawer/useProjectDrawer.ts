import { useState, Dispatch, SetStateAction } from 'react'
import { Project, ProjectData } from '../../types/project'

export interface UseProjectDrawerReturn {
  isEditing: boolean
  draftName: string
  setDraftName: Dispatch<SetStateAction<string>>
  startEditing: () => void
  cancelEditing: () => void
  saveChanges: () => void
  deleteProject: () => void
}

export const useProjectDrawer = (
  project: Project | null,
  onUpdate: (id: string, updates: Partial<ProjectData>) => void,
  onDelete: (id: string) => void,
  onClose: () => void
): UseProjectDrawerReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState('')

  const startEditing = (): void => {
    if (project) {
      setDraftName(project.name)
      setIsEditing(true)
    }
  }

  const cancelEditing = (): void => {
    setIsEditing(false)
    setDraftName('')
  }

  const saveChanges = (): void => {
    if (project && draftName.trim() !== '') {
      onUpdate(project.id, { name: draftName })
      setIsEditing(false)
    }
  }

  const deleteProject = (): void => {
    if (project && confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id)
      onClose()
    }
  }

  return {
    isEditing,
    draftName,
    setDraftName,
    startEditing,
    cancelEditing,
    saveChanges,
    deleteProject
  }
}
