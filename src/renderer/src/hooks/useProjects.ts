import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Project, ProjectData } from '../types/project'

export function useProjects(): {
  projects: Project[]
  isLoading: boolean
  addProject: (projectData: ProjectData) => Promise<void>
  updateProject: (id: string, updates: Partial<ProjectData>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  refreshProject: (id: string, path: string) => Promise<void>
} {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchProjects = useCallback(async (): Promise<Project[]> => {
    return (await window.api.db.getProjects()) as Project[]
  }, [])

  const loadProjects = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const loadedProjects = await fetchProjects()
      setProjects(loadedProjects)
    } finally {
      setIsLoading(false)
    }
  }, [fetchProjects])

  // Initial load
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const addProject = async (projectData: ProjectData): Promise<void> => {
    setIsLoading(true)
    try {
      const newProject: Project = {
        id: uuidv4(),
        ...projectData,
        createdAt: Date.now()
      }
      const result = await window.api.db.addProject(newProject)
      if (result.success) {
        await loadProjects()
      } else {
        console.error('Failed to add project', result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateProject = async (id: string, updates: Partial<ProjectData>): Promise<void> => {
    setIsLoading(true)
    try {
      const result = await window.api.db.updateProject(id, updates)
      if (result.success) {
        await loadProjects()
      } else {
        console.error('Failed to update project', result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async (id: string): Promise<void> => {
    setIsLoading(true)
    try {
      const result = await window.api.db.deleteProject(id)
      if (result.success) {
        await loadProjects()
      } else {
        console.error('Failed to delete project', result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProject = async (id: string, path: string): Promise<void> => {
    setIsLoading(true)
    try {
      // @ts-ignore (defined in preload)
      const result = await window.api.refreshProjectData(path, id)
      if (result.success) {
        await loadProjects()
      } else {
        console.error('Failed to refresh project', result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    refreshProject
  }
}
