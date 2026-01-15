import { useState, useMemo } from 'react'
import { Project } from '../types/project'

export type FilterType = 'all' | 'Work' | 'Personal'

export function useProjectFilter(projects: Project[]): {
  filter: FilterType
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  filteredProjects: Project[]
} {
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesFilter = filter === 'all' || p.projectType === filter
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [projects, filter, searchQuery])

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredProjects
  }
}
