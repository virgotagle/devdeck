import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DBConfig {
  user?: string
  password?: string
  host?: string
  port?: number
  database?: string
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<DBConfig>({})
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadConfig()
    }
  }, [isOpen])

  const loadConfig = async (): Promise<void> => {
    try {
      const savedConfig = await window.api.db.getConfig()
      if (savedConfig && typeof savedConfig === 'object') {
        setConfig(savedConfig as DBConfig)
      }
    } catch (err) {
      console.error('Failed to load config:', err)
    }
  }

  const handleChange = (key: keyof DBConfig, value: string): void => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setTestStatus('idle')
    setErrorMessage(null)
  }

  const handleTestConnection = async (): Promise<void> => {
    setIsLoading(true)
    setTestStatus('idle')
    setErrorMessage(null)
    try {
      const result = await window.api.db.testConnection(config)
      if (result.success) {
        setTestStatus('success')
      } else {
        setTestStatus('error')
        setErrorMessage(result.error || 'Connection failed')
      }
    } catch (err) {
      setTestStatus('error')
      setErrorMessage(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (): Promise<void> => {
    try {
      await window.api.db.saveConfig(config)
      onClose()
    } catch (err) {
      console.error('Failed to save config:', err)
      setErrorMessage('Failed to save configuration')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Database Settings">
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Host</label>
            <Input
              value={config.host || ''}
              onChange={(e) => handleChange('host', e.target.value)}
              placeholder="localhost"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Port</label>
            <Input
              type="number"
              value={config.port || ''}
              onChange={(e) => handleChange('port', e.target.value)}
              placeholder="5432"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Database Name</label>
          <Input
            value={config.database || ''}
            onChange={(e) => handleChange('database', e.target.value)}
            placeholder="postgres"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">User</label>
            <Input
              value={config.user || ''}
              onChange={(e) => handleChange('user', e.target.value)}
              placeholder="postgres"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <Input
              type="password"
              value={config.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Status Message */}
        {testStatus === 'success' && (
          <div className="flex items-center text-green-400 text-sm bg-green-400/10 p-2 rounded">
            <CheckCircle2 size={16} className="mr-2" />
            Connection successful
          </div>
        )}
        {testStatus === 'error' && (
          <div className="flex items-center text-red-400 text-sm bg-red-400/10 p-2 rounded">
            <AlertCircle size={16} className="mr-2" />
            {errorMessage || 'Connection failed'}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Test Connection
          </Button>
          <Button onClick={handleSave} disabled={isLoading} type="button">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SettingsModal
