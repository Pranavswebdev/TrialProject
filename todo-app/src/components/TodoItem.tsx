import type { Todo } from './TodoApp'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 cursor-pointer accent-green-500"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        className={`flex-1 text-base text-left cursor-pointer transition-all ${
          todo.completed
            ? 'line-through text-gray-400'
            : 'text-gray-900'
        }`}
      >
        {todo.text}
      </button>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
        aria-label={`Delete "${todo.text}"`}
      >
        ×
      </button>
    </div>
  )
}
