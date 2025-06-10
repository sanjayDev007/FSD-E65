import React from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

//todo list
/*{
  id: "sjdfhjkdsnf",
  text: "Buy groceries",
  completed: false,
  createdAt: "2023-10-01T12:00:00Z",
  updatedAt: "2023-10-01T12:00:00Z"
} */ 

function App() {
  const [todoList, setTodoList] = React.useState([]);
  return (
    <>
      <div className='min-h-screen bg-gray-100 grid grid-cols-3'>
          <TodoForm todoList={todoList} setTodoList={setTodoList}/>
          <div className='col-span-2'>
            <TodoList todoList={todoList} setTodoList={setTodoList} />
          </div>
      </div>
    </>
  )
}

export default App