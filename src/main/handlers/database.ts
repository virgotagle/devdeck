import { ipcMain } from 'electron'
import { ProjectRepository, Project } from '../services/ProjectRepository'
import log from '../logger'

export function registerDatabaseHandlers(): void {
  ipcMain.handle('db:getProjects', async () => {
    try {
      return await ProjectRepository.getAll()
    } catch (error) {
      log.error('Failed to get projects:', error)
      return []
    }
  })

  ipcMain.handle('db:addProject', async (_, project: Project) => {
    try {
      await ProjectRepository.add(project)
      return { success: true }
    } catch (error) {
      log.error('Failed to add project:', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle(
    'db:updateProject',
    async (_, { id, updates }: { id: string; updates: Partial<Project> }) => {
      try {
        await ProjectRepository.update(id, updates)
        return { success: true }
      } catch (error) {
        log.error('Failed to update project:', error)
        return { success: false, error: String(error) }
      }
    }
  )

  ipcMain.handle('db:deleteProject', async (_, id: string) => {
    try {
      await ProjectRepository.delete(id)
      return { success: true }
    } catch (error) {
      log.error('Failed to delete project:', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('db:checkPathExists', async (_, path: string) => {
    try {
      const exists = await ProjectRepository.checkPathExists(path)
      return { exists }
    } catch (error) {
      log.error('Failed to check path existence:', error)
      return { exists: false, error: String(error) }
    }
  })
}
