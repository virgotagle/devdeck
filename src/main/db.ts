import { Pool } from 'pg'
import log from './logger'
import Store from 'electron-store'
import { safeStorage } from 'electron'

export interface DBConfig {
  user?: string
  password?: string
  host?: string
  port?: number
  database?: string
}

interface StoreSchema {
  dbConfig: DBConfig
}

// @ts-ignore (define in d.ts)
const StoreClass = Store.default || Store
const store = new StoreClass<StoreSchema>({
  name: 'db-config',
  defaults: {
    dbConfig: {
      user: process.env.POSTGRES_USERNAME,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432
    }
  }
})

let pool: Pool | null = null
let currentConfig: DBConfig | null = null

const encryptPassword = (password: string): string => {
  if (!password) return password
  if (safeStorage.isEncryptionAvailable()) {
    try {
      return safeStorage.encryptString(password).toString('hex')
    } catch (error) {
      log.error('Encryption failed:', error)
      return password
    }
  }
  return password
}

const decryptPassword = (password: string): string => {
  if (!password) return password
  if (safeStorage.isEncryptionAvailable()) {
    try {
      const buffer = Buffer.from(password, 'hex')
      return safeStorage.decryptString(buffer)
    } catch {
      // Assuming it might be plain text or legacy
      return password
    }
  }
  return password
}

export const getConfig = (): DBConfig => {
  const config = store.get('dbConfig')
  if (config && config.password) {
    return {
      ...config,
      password: decryptPassword(config.password)
    }
  }
  return config
}

export const saveConfig = (config: DBConfig): void => {
  const configToSave = { ...config }
  if (configToSave.password) {
    configToSave.password = encryptPassword(configToSave.password)
  }
  store.set('dbConfig', configToSave)

  // Force pool recreation
  if (pool) {
    pool.end().catch((err) => log.error('Failed to close pool', err))
    pool = null
  }
}

export const getPool = (): Pool => {
  const config = getConfig()

  // Check if config has changed effectively (simple comparison)
  const configChanged = JSON.stringify(config) !== JSON.stringify(currentConfig)

  if (!pool || configChanged) {
    if (pool) {
      pool.end().catch((err) => log.error('Failed to close old pool', err))
    }

    log.info('Initializing DB Pool with config:', { ...config, password: '***' })
    currentConfig = config

    pool = new Pool({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port ? parseInt(String(config.port), 10) : 5432,
      database: config.database
    })
  }
  return pool
}

export const testConnection = async (config: DBConfig): Promise<boolean> => {
  const tempPool = new Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port ? parseInt(String(config.port), 10) : 5432,
    database: config.database,
    connectionTimeoutMillis: 5000 // 5s timeout
  })

  try {
    const client = await tempPool.connect()
    client.release()
    return true
  } catch (error) {
    log.error('Test connection failed:', error)
    throw error
  } finally {
    await tempPool.end()
  }
}

export const initDB = async (): Promise<void> => {
  const p = getPool()
  const client = await p.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        project_type VARCHAR(50) NOT NULL,
        created_at BIGINT NOT NULL,
        git_remote_url VARCHAR(255),
        readme TEXT,
        project_manifest TEXT
      );
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_manifest TEXT;
    `)
  } finally {
    client.release()
  }
}
