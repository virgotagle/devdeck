import { useState, useCallback } from 'react'

interface UseCopyToClipboardReturn {
  isCopied: boolean
  copy: (text: string) => Promise<boolean>
}

export function useCopyToClipboard(timeout = 2000): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported')
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), timeout)
        return true
      } catch (error) {
        console.warn('Copy failed', error)
        setIsCopied(false)
        return false
      }
    },
    [timeout]
  )

  return { isCopied, copy }
}
