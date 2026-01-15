import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  selectProjectFolder: (): Promise<unknown> => ipcRenderer.invoke('dialog:openProject'),
  openInVsCode: (path: string): Promise<unknown> => ipcRenderer.invoke('shell:openInVsCode', path),
  openInAntigravity: (path: string): Promise<unknown> =>
    ipcRenderer.invoke('shell:openInAntigravity', path),
  openInTerminal: (path: string): Promise<unknown> =>
    ipcRenderer.invoke('shell:openInTerminal', path),
  openDirectory: (path: string): Promise<unknown> =>
    ipcRenderer.invoke('shell:openDirectory', path),
  db: {
    getProjects: (): Promise<unknown> => ipcRenderer.invoke('db:getProjects'),
    addProject: (project: unknown): Promise<unknown> =>
      ipcRenderer.invoke('db:addProject', project),
    updateProject: (id: string, updates: unknown): Promise<unknown> =>
      ipcRenderer.invoke('db:updateProject', { id, updates }),
    deleteProject: (id: string): Promise<unknown> => ipcRenderer.invoke('db:deleteProject', id),
    checkPathExists: (path: string): Promise<unknown> =>
      ipcRenderer.invoke('db:checkPathExists', path),
    getConfig: (): Promise<unknown> => ipcRenderer.invoke('db:get-config'),
    saveConfig: (config: unknown): Promise<unknown> => ipcRenderer.invoke('db:save-config', config),
    testConnection: (config: unknown): Promise<unknown> =>
      ipcRenderer.invoke('db:test-connection', config)
  },
  refreshProjectData: (path: string, id: string): Promise<unknown> =>
    ipcRenderer.invoke('project:refreshData', { path, id })
}

// Minimal Electron API replacement for what the app uses (process.versions)
const electronAPI = {
  process: {
    versions: process.versions
  },
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]): void => ipcRenderer.send(channel, ...args),
    on: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on(channel, listener)
      return () => {
        ipcRenderer.removeListener(channel, listener)
      }
    },
    once: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ) => {
      ipcRenderer.once(channel, listener)
    },
    removeListener: (channel: string, listener: (...args: unknown[]) => void) => {
      ipcRenderer.removeListener(channel, listener)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
