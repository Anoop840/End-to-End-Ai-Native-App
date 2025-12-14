import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');

  const handleAddTodo = () => {
    if (newTodoText.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(), // Simple unique ID
      text: newTodoText.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          Todo List
        </h1>

        {/* Input and Add Button */}
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Add a new todo..."
            value={newTodoText}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
          <button
            onClick={handleAddTodo}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>

        {/* Conditional No Todos Message */}
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg py-8">
            No todos yet! Add some tasks to get started.
          </p>
        ) : (
          /* Todo List */
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-3 sm:p-4 shadow-sm"
              >
                <div className="flex items-center flex-grow cursor-pointer" onClick={() => handleToggleComplete(todo.id)}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)} // This will be handled by parent div click too
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition duration-150 ease-in-out dark:bg-gray-600 dark:border-gray-500"
                  />
                  <span
                    className={`ml-3 text-lg ${
                      todo.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
