import React from 'react'

function TodoForm({ todoList, setTodoList }) {
    const [todo, setTodo] = React.useState('');
    function handleSubmit(e) {
      e.preventDefault();
        if (todo.trim() === '') {
            alert('Please enter a todo');
            return;
        }
        const newTodo = {
            id: Date.now().toString(),
            text: todo,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const existingTodo = todoList.find(t => t.text === newTodo.text);
        let updatedTodo = [];
        if (existingTodo) {
            updatedTodo = todoList.map(t => 
                t.text === newTodo.text ? { ...t, updatedAt: new Date().toISOString() } : t
            );
        }else {
           updatedTodo = [...todoList, newTodo];
        }
        updatedTodo.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTodoList(updatedTodo);
        setTodo('');
    }

    function handleTodoChange(e) {
        setTodo(e.target.value);
    }
  return (
   <>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Add a New Todo</h2>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="todo">
                Todo
            </label>
            <input
                type="text"
                id="todo"
                placeholder="Enter your todo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleTodoChange}
                value={todo}
                autoComplete='off'
                required
            />
            </div>
            <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Add Todo
            </button>
        </form>
   </>
  )
}

export default TodoForm