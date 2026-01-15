import { ipcMain, shell } from 'electron'
import { spawn, SpawnOptions } from 'child_process'
import log from '../logger'

function spawnAsync(command: string, args: string[], options: SpawnOptions = {}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: 'ignore' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve(true)
      else reject(new Error(`Command failed with code ${code}`))
    })
  })
}

export function registerShellHandlers(): void {
  ipcMain.handle('shell:openInVsCode', async (_, path: string) => {
    try {
      await spawnAsync('code', ['.'], { cwd: path, shell: process.platform === 'win32' })
      return { success: true }
    } catch (error) {
      log.error('Failed to open in VS Code:', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('shell:openInAntigravity', async (_, path: string) => {
    try {
      await spawnAsync('antigravity', ['.'], { cwd: path, shell: process.platform === 'win32' })
      return { success: true }
    } catch (error) {
      log.error('Failed to open in Antigravity:', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('shell:openInTerminal', async (_, path: string) => {
    try {
      if (process.platform === 'darwin') {
        await spawnAsync('open', ['-a', 'Terminal', '.'], { cwd: path })
      } else if (process.platform === 'win32') {
        await spawnAsync('cmd.exe', ['/c', 'start', 'cmd', '/k'], { cwd: path, shell: false })
      } else {
        // Attempt to open terminal in the directory
        await spawnAsync('x-terminal-emulator', [], { cwd: path })
      }
      return { success: true }
    } catch (error) {
      log.error('Failed to open in Terminal:', error)
      return { success: false, error: String(error) }
    }
  })

  ipcMain.handle('shell:openDirectory', async (_, path: string) => {
    try {
      await shell.openPath(path)
      return { success: true }
    } catch (error) {
      log.error('Failed to open directory:', error)
      return { success: false, error: String(error) }
    }
  })
}
