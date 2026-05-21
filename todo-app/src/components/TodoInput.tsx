import { useState } from 'react'

interface TodoInputProps {
  onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed) {
      onAdd(trimmed)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-6 flex gap-3">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        aria-label="Add a new task"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!input.trim()}
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="Add task"
      >
        Add
      </button>
    </div>
  )
}
