import log from 'electron-log'
import { is } from '@electron-toolkit/utils'

// Optional, initialize the logger for any renderer process
log.initialize()

log.transports.file.level = 'info'
log.transports.console.level = is.dev ? 'debug' : 'info'

// Format log messages
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
log.transports.console.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}'

export default log
