import { useState, useEffect } from 'react';
import { CheckCircle, Edit2, Trash2, PlusCircle } from 'lucide-react';
import './App.css';
import React from 'react';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const res = await fetch('http://localhost:4000/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (task.trim() === '') return alert('Task cannot be empty');
    await fetch('http://localhost:4000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });
    setTask('');
    loadTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:4000/todos/${id}`, { method: 'DELETE' });
    loadTodos();
  };

  const toggleComplete = async (id, completed) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    loadTodos();
  };

  const editTodo = async (id, currentTask) => {
    const newTask = prompt('Edit Task:', currentTask);
    if (newTask && newTask.trim() !== '') {
      await fetch(`http://localhost:4000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask.trim() })
      });
      loadTodos();
    }
  };

  return (
    <>
      <div className="app-container">
        <div className="todo-box">
          <h1>Todo App</h1>
          <div className="todo-input">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task..."
            />
            <button onClick={addTodo}>
              <PlusCircle size={20} />
            </button>
          </div>
          <ul className="todo-list">
     {todos.map((todo, index) => (
  <li key={todo.id || index} className="todo-item">             
     <div className="todo-left">
                  <div
                    className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                    onClick={() => toggleComplete(todo.id, !todo.completed)}
                  ></div>
                  <span className={todo.completed ? 'completed' : ''}>{todo.task}</span>
                </div>
              <div className="todo-actions">
  <button onClick={() => editTodo(todo.id, todo.task)}>
    <Edit2 size={18} />
  </button>
  <button onClick={() => deleteTodo(todo.id)}>
    <Trash2 size={18} />
  </button>
</div>

              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
