import { ipcMain } from 'electron'
import { getConfig, saveConfig, testConnection, DBConfig } from '../db'
import log from '../logger'

export const registerSettingsHandlers = (): void => {
  ipcMain.handle('db:get-config', async () => {
    return getConfig()
  })

  ipcMain.handle('db:save-config', async (_, config: DBConfig) => {
    log.info('Saving new DB config')
    saveConfig(config)
    return true
  })

  ipcMain.handle('db:test-connection', async (_, config: DBConfig) => {
    log.info('Testing DB connection')
    try {
      await testConnection(config)
      return { success: true }
    } catch (error) {
      log.error('Test connection failed', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })
}
