import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectProjectFolder: () => Promise<{
        name: string
        path: string
        description: string
        type: string
        readme: string
        gitRemoteUrl?: string
        canceled: boolean
      }>
      openInVsCode: (path: string) => Promise<{ success: boolean; error?: string }>
      openInAntigravity: (path: string) => Promise<{ success: boolean; error?: string }>
      openInTerminal: (path: string) => Promise<{ success: boolean; error?: string }>
      openDirectory: (path: string) => Promise<{ success: boolean; error?: string }>
      db: {
        getProjects: () => Promise<
          Array<{
            id: string
            name: string
            path: string
            language: string
            projectType: string
            createdAt: number
            gitRemoteUrl?: string
            readme?: string
            projectManifest?: string
          }>
        >
        addProject: (project: {
          id: string
          name: string
          path: string
          language: string
          projectType: string
          createdAt: number
          gitRemoteUrl?: string
          readme?: string
          projectManifest?: string
        }) => Promise<{ success: boolean; error?: string }>
        updateProject: (
          id: string,
          updates: Partial<{
            name: string
            path: string
            language: string
            projectType: string
            gitRemoteUrl: string
            readme: string
            projectManifest: string
          }>
        ) => Promise<{ success: boolean; error?: string }>
        deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>
        checkPathExists: (path: string) => Promise<{ exists: boolean; error?: string }>
        getConfig: () => Promise<unknown>
        saveConfig: (config: unknown) => Promise<unknown>
        testConnection: (config: unknown) => Promise<{ success: boolean; error?: string }>
      }
    }
  }
}
