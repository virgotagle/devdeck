import { getPool } from '../db'
import log from '../logger'

export interface Project {
  id: string
  name: string
  path: string
  language: string
  projectType: string
  createdAt: number
  gitRemoteUrl?: string
  readme?: string
  projectManifest?: string
}

export const ProjectRepository = {
  async getAll(): Promise<Project[]> {
    const { rows } = await getPool().query('SELECT * FROM projects ORDER BY created_at DESC')
    log.info(`[DB] Fetched ${rows.length} projects`)
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      path: row.path,
      language: row.language,
      projectType: row.project_type,
      createdAt: parseInt(row.created_at, 10),
      gitRemoteUrl: row.git_remote_url,
      readme: row.readme,
      projectManifest: row.project_manifest
    }))
  },

  async add(project: Project): Promise<void> {
    await getPool().query(
      `INSERT INTO projects (id, name, path, language, project_type, created_at, git_remote_url, readme, project_manifest)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        project.id,
        project.name,
        project.path,
        project.language,
        project.projectType,
        project.createdAt,
        project.gitRemoteUrl,
        project.readme,
        project.projectManifest
      ]
    )
  },

  async update(id: string, updates: Partial<Project>): Promise<void> {
    log.info(`[DB] Updating project ${id} with:`, updates)
    const keys = Object.keys(updates)
    if (keys.length === 0) return

    const fieldMap: Record<string, string> = {
      name: 'name',
      path: 'path',
      language: 'language',
      projectType: 'project_type',
      gitRemoteUrl: 'git_remote_url',
      readme: 'readme',
      projectManifest: 'project_manifest'
    }

    const setClauses: string[] = []
    const values: (string | number | null | undefined)[] = []
    let paramIndex = 1

    for (const key of keys) {
      const dbField = fieldMap[key]
      if (dbField) {
        setClauses.push(`${dbField} = $${paramIndex}`)
        values.push(updates[key])
        paramIndex++
      }
    }

    if (setClauses.length === 0) return

    values.push(id)
    const query = `UPDATE projects SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`

    await getPool().query(query, values)
    log.info(`[DB] Update successful`)
  },

  async delete(id: string): Promise<void> {
    await getPool().query('DELETE FROM projects WHERE id = $1', [id])
  },

  async checkPathExists(path: string): Promise<boolean> {
    const { rows } = await getPool().query('SELECT 1 FROM projects WHERE path = $1', [path])
    return rows.length > 0
  }
}
