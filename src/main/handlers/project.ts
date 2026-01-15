import { ipcMain, dialog, BrowserWindow, app } from 'electron'
import { basename, join } from 'path'
import { FileScanner } from '../services/FileScanner'
import log from '../logger'

export function registerProjectHandlers(): void {
  ipcMain.handle('dialog:openProject', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: join(app.getPath('home'), 'Projects')
    })

    if (canceled) {
      return { canceled: true }
    }

    const dirPath = filePaths[0]
    const folderName = basename(dirPath)

    try {
      const scanResult = await FileScanner.scanProjectDirectory(dirPath)

      if (scanResult.readme === null) {
        const win = BrowserWindow.getFocusedWindow()
        if (win) {
          await dialog.showMessageBox(win, {
            type: 'error',
            title: 'No Documentation Found',
            message: 'No README.md or markdown file found in this folder.',
            detail: 'Please select a project folder that contains documentation.'
          })
        }
        return { canceled: true }
      }

      return {
        canceled: false,
        name: folderName,
        path: dirPath,
        readme: scanResult.readme,
        gitRemoteUrl: scanResult.gitRemoteUrl,
        type: 'javascript' // Default, can be inferred later
      }
    } catch (error) {
      log.error('Error reading project files:', error)
      return { canceled: true }
    }
  })

  ipcMain.handle('project:refreshData', async (_, { path, id }: { path: string; id: string }) => {
    try {
      const scanResult = await FileScanner.scanProjectDirectory(path)
      const updates = {
        readme: scanResult.readme || undefined,
        gitRemoteUrl: scanResult.gitRemoteUrl || undefined
      }

      const { ProjectRepository } = await import('../services/ProjectRepository')
      await ProjectRepository.update(id, updates)

      return { success: true, data: updates }
    } catch (error) {
      log.error('Error refreshing project data:', error)
      return { success: false, error: String(error) }
    }
  })
}
