import { z } from 'zod'

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  path: z.string().min(1, 'Project path is required'),
  language: z.enum(['python', 'javascript'], {
    message: 'Please select a language'
  }),
  projectType: z.enum(['Work', 'Personal'], {
    message: 'Please select a project type'
  }),
  readme: z.string().min(1, 'Readme content is required'),
  gitRemoteUrl: z.string().optional(),
  projectManifest: z.string().optional()
})

export type ProjectData = z.infer<typeof ProjectSchema>

export interface Project extends ProjectData {
  id: string
  createdAt: number
}
