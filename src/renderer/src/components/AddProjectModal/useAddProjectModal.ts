import { useState, FormEvent } from 'react'
import { ProjectSchema, ProjectData } from '../../types/project'

interface UseAddProjectModalProps {
  onAdd: (project: ProjectData) => void
  onClose: () => void
  initialName?: string
  initialPath?: string
  initialReadme?: string
  initialGitRemoteUrl?: string
}

interface UseAddProjectModalReturn {
  name: string
  setName: (name: string) => void
  path: string
  setPath: (path: string) => void
  language: 'python' | 'javascript' | null
  setLanguage: (lang: 'python' | 'javascript' | null) => void
  projectType: 'Work' | 'Personal' | null
  setProjectType: (type: 'Work' | 'Personal' | null) => void
  errors: { [key in keyof ProjectData]?: string }
  handleSubmit: (e: FormEvent) => void
}

export const useAddProjectModal = ({
  onAdd,
  onClose,
  initialName = '',
  initialPath = '',
  initialReadme,
  initialGitRemoteUrl
}: UseAddProjectModalProps): UseAddProjectModalReturn => {
  const [name, setName] = useState(initialName)
  const [path, setPath] = useState(initialPath)
  const [language, setLanguage] = useState<'python' | 'javascript' | null>(null)
  const [projectType, setProjectType] = useState<'Work' | 'Personal' | null>(null)
  const [errors, setErrors] = useState<{ [key in keyof ProjectData]?: string }>({})

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    const rawData = {
      name,
      path,
      language,
      projectType,
      readme: initialReadme,
      gitRemoteUrl: initialGitRemoteUrl
    }

    const result = ProjectSchema.safeParse(rawData)

    if (!result.success) {
      const formatErrors: { [key in keyof ProjectData]?: string } = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ProjectData
        formatErrors[path] = issue.message
      })
      setErrors(formatErrors)
      return
    }

    // Check if path already exists
    const checkResult = await window.api.db.checkPathExists(result.data.path)
    if (checkResult.exists) {
      setErrors({ path: 'This path is already added to the database' })
      return
    }

    onAdd(result.data)

    // Reset form
    setName('')
    setPath('')
    setLanguage(null)
    setProjectType(null)
    setErrors({})
    onClose()
  }

  const handleLanguageChange = (val: 'python' | 'javascript' | null): void => {
    setLanguage(val)
    setErrors((prev) => ({ ...prev, language: undefined }))
  }

  const handleProjectTypeChange = (val: 'Work' | 'Personal' | null): void => {
    setProjectType(val)
    setErrors((prev) => ({ ...prev, projectType: undefined }))
  }

  return {
    name,
    setName,
    path,
    setPath,
    language,
    setLanguage: handleLanguageChange,
    projectType,
    setProjectType: handleProjectTypeChange,
    errors,
    handleSubmit
  }
}
