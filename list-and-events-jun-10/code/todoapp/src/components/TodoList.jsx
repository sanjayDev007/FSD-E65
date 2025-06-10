import React from 'react'

function TodoList({ todoList, setTodoList }) {
    function handleDelete(id) {
        setTodoList(prevList => prevList.filter(todo => todo.id !== id));
    }
    function handleComplete(id,value) {
        let updatedTodo = todoList.map(todo => 
            todo.id === id ? { ...todo, completed: value, updatedAt: new Date().toISOString() } : todo
        )
        updatedTodo.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTodoList(updatedTodo);
    }
  return (
    <>
        <div className="min-h-screen bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className='text-center'>Todo List</h1>
            <div className="mt-8">
                <ul className="space-y-3">
                    {
                        todoList.length === 0 ? (
                            <li className="text-gray-500 text-center">No todos available. Please add some!</li>
                        ) : (
                            todoList.map(todo => (
                                <li key={todo.id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors ${todo.completed ? 'line-through opacity-60' : ''}`}>
                                    <span className="text-gray-800">{todo.text}</span>
                                    <span className="text-gray-500 text-xs">{new Date(todo.createdAt).toLocaleDateString()}</span>
                                    <span className="text-gray-500 text-xs">{new Date(todo.updatedAt).toLocaleTimeString()}</span>
                                    <div className="flex space-x-2">
                                        {todo.completed ? (
                                            <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors" onClick={() => handleComplete(todo.id, false)}>
                                                Undo
                                            </button>
                                        ) : (
                                            <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors" onClick={() => handleComplete(todo.id, true)}>
                                                Complete
                                            </button>
                                        )}
                                        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        onClick={()=> handleDelete(todo.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        )
                    }
                </ul>
            </div>
        </div>
    </>
  )
}

export default TodoList