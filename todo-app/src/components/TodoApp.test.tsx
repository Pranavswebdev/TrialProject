import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TodoApp } from './TodoApp'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('TodoApp', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders empty state when no tasks', () => {
    render(<TodoApp />)
    expect(screen.getByText('No tasks yet!')).toBeInTheDocument()
    expect(screen.getByText('Add a new task to get started')).toBeInTheDocument()
  })

  it('renders header with title', () => {
    render(<TodoApp />)
    expect(screen.getByText('My To-Do App')).toBeInTheDocument()
    expect(screen.getByText('Stay organized and productive')).toBeInTheDocument()
  })

  it('adds a new task', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(input, 'Buy groceries')
    await user.click(addButton)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('does not add empty tasks', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const addButton = screen.getByRole('button', { name: /add/i })
    expect(addButton).toBeDisabled()

    const input = screen.getByPlaceholderText('What needs to be done?')
    await user.type(input, '   ')
    expect(addButton).toBeDisabled()
  })

  it('allows adding task with Enter key', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('What needs to be done?')
    await user.type(input, 'Call mom{Enter}')

    expect(screen.getByText('Call mom')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('toggles task completion', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(input, 'Buy groceries')
    await user.click(addButton)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('deletes a task', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(input, 'Buy groceries')
    await user.click(addButton)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
    expect(screen.getByText('No tasks yet!')).toBeInTheDocument()
  })

  it('persists tasks to localStorage', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<TodoApp />)

    const input = screen.getByPlaceholderText('What needs to be done?')
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(input, 'Buy groceries')
    await user.click(addButton)

    const stored = localStorage.getItem('todos')
    expect(stored).toBeTruthy()
    if (!stored) throw new Error('Stored todos should not be null')
    const parsedTodos = JSON.parse(stored)
    expect(parsedTodos).toHaveLength(1)
    expect(parsedTodos[0].text).toBe('Buy groceries')

    unmount()

    render(<TodoApp />)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })
})
