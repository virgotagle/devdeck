import React from 'react'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Refreshing data...'
}) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-all duration-300 animate-in fade-in">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-purple-500/20" />
        </div>
        <p className="text-slate-300 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
