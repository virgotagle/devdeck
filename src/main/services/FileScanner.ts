import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import log from '../logger'

const execAsync = promisify(exec)

export interface ScanResult {
  readme: string | null
  gitRemoteUrl?: string
}

export const FileScanner = {
  async scanProjectDirectory(dirPath: string): Promise<ScanResult> {
    let readme: string | null = null
    let gitRemoteUrl = ''

    try {
      const files = await readdir(dirPath)

      // Check for README
      const mdFile =
        files.find((file) => file.toLowerCase() === 'readme.md') ||
        files.find((file) => file.toLowerCase().endsWith('.md'))

      if (mdFile) {
        readme = await readFile(join(dirPath, mdFile), 'utf-8')
      }

      // Check for .git and get remote URL
      if (files.includes('.git')) {
        try {
          const { stdout } = await execAsync('git config --get remote.origin.url', { cwd: dirPath })
          gitRemoteUrl = stdout.trim()
        } catch (error) {
          // Ignore error if not a git repo or no remote
          log.warn('No git remote found or error getting it:', error)
        }
      }
    } catch (error) {
      log.error('Error reading project files:', error)
      // If readdir fails, we arguably might want to rethrow, but original code
      // swallowed the error and returned partial data.
      // However, original code would SKIP the "no readme found" check if readdir failed (because that check was inside the try).
      // Here, if readdir fails, readme remains null.
    }

    return {
      readme,
      gitRemoteUrl: gitRemoteUrl || undefined
    }
  }
}
