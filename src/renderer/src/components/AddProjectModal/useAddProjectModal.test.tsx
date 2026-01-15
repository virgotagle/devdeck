import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAddProjectModal } from './useAddProjectModal'
import { FormEvent } from 'react'

// Mock the window.api object
const mockCheckPathExists = vi.fn()
Object.assign(window, {
  api: {
    db: {
      checkPathExists: mockCheckPathExists
    }
  }
})

describe('useAddProjectModal', () => {
  const mockOnAdd = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCheckPathExists.mockResolvedValue({ exists: false })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useAddProjectModal({
        onAdd: mockOnAdd,
        onClose: mockOnClose
      })
    )

    expect(result.current.name).toBe('')
    expect(result.current.path).toBe('')
    expect(result.current.language).toBeNull()
    expect(result.current.projectType).toBeNull()
    expect(result.current.errors).toEqual({})
  })

  it('should update state values', () => {
    const { result } = renderHook(() =>
      useAddProjectModal({
        onAdd: mockOnAdd,
        onClose: mockOnClose
      })
    )

    act(() => {
      result.current.setName('My Project')
      result.current.setPath('/path/to/project')
      result.current.setLanguage('javascript')
      result.current.setProjectType('Personal')
    })

    expect(result.current.name).toBe('My Project')
    expect(result.current.path).toBe('/path/to/project')
    expect(result.current.language).toBe('javascript')
    expect(result.current.projectType).toBe('Personal')
  })

  it('should validate required fields', async () => {
    const { result } = renderHook(() =>
      useAddProjectModal({
        onAdd: mockOnAdd,
        onClose: mockOnClose
      })
    )

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as FormEvent)
    })

    expect(result.current.errors).toHaveProperty('name')
    expect(result.current.errors).toHaveProperty('path')
    expect(result.current.errors).toHaveProperty('language')
    expect(result.current.errors).toHaveProperty('projectType')
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('should handle duplicate path error', async () => {
    mockCheckPathExists.mockResolvedValue({ exists: true })

    const { result } = renderHook(() =>
      useAddProjectModal({
        onAdd: mockOnAdd,
        onClose: mockOnClose,
        initialName: 'Test Project',
        initialPath: '/existing/path',
        initialReadme: 'Readme'
      })
    )

    // Set other required fields manually
    act(() => {
      result.current.setLanguage('javascript')
      result.current.setProjectType('Work')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as FormEvent)
    })

    expect(result.current.errors.path).toBe('This path is already added to the database')
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('should submit successfully when form is valid', async () => {
    const { result } = renderHook(() =>
      useAddProjectModal({
        onAdd: mockOnAdd,
        onClose: mockOnClose,
        initialName: 'Valid Project',
        initialPath: '/valid/path',
        initialReadme: 'Test Readme'
      })
    )

    act(() => {
      result.current.setLanguage('python')
      result.current.setProjectType('Personal')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as FormEvent)
    })

    expect(result.current.errors).toEqual({})
    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Valid Project',
        path: '/valid/path',
        language: 'python',
        projectType: 'Personal',
        readme: 'Test Readme'
      })
    )
    expect(mockOnClose).toHaveBeenCalled()
  })
})
