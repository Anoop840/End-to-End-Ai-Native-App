'use client';

import React, { useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = newTodoText.trim();
    if (trimmedText) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: trimmedText,
        completed: false,
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoText('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          My Todo List
        </h2>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-gray-800"
            placeholder="Add a new task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            No tasks yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm group"
              >
                <div className="flex items-center flex-grow">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:checked:bg-blue-600 dark:checked:border-blue-600 transition-colors duration-200"
                  />
                  <span
                    className={`ml-4 text-lg flex-grow text-gray-800 dark:text-gray-100 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-4 p-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete task"
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
