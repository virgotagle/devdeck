import { Search, Plus, Settings } from 'lucide-react'
import { FilterType } from '../hooks/useProjectFilter'
/* eslint-disable react/prop-types */
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface HeaderProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddProject: () => void
  onOpenSettings: () => void
}

const Header: React.FC<HeaderProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onAddProject,
  onOpenSettings
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30 flex items-center justify-between px-6">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-lg">D</span>
          </div>
          <span className="font-bold text-xl tracking-tight">DevDeck</span>
        </div>

        <nav className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-lg">
          {(['all', 'Work', 'Personal'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange(f)}
              className={filter === f ? 'bg-slate-700 shadow-sm' : 'text-slate-400'}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
            size={18}
          />
          <div className="w-64">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="text-slate-400 hover:text-white"
        >
          <Settings size={20} />
        </Button>

        <Button onClick={onAddProject} className="rounded-full shadow-lg shadow-indigo-900/20">
          <Plus size={18} className="mr-2" />
          Add Project
        </Button>
      </div>
    </header>
  )
}

export default Header
