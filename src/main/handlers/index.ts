import { registerShellHandlers } from './shell'
import { registerDatabaseHandlers } from './database'
import { registerProjectHandlers } from './project'
import { registerSettingsHandlers } from './settings'

export function registerHandlers(): void {
  registerShellHandlers()
  registerDatabaseHandlers()
  registerProjectHandlers()
  registerSettingsHandlers()
}
