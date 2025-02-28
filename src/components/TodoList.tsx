import React from 'react';
import { useState, useEffect, useCallback } from 'react';

interface Todo {
  id: string;
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState({
    activity: '',
    price: 0,
    type: 'education',
    bookingRequired: false,
    accessibility: 0.5,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage on todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo = {
      id: Date.now().toString(),
      ...formData,
    };
    setTodos(prev => [...prev, newTodo]);
    setFormData({ ...formData, activity: '', price: 0 }); // Reset form
  };

  const handleDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
      <h1>Todo List ({todos.length})</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Activity"
          required
          value={formData.activity}
          onChange={e => setFormData({ ...formData, activity: e.target.value })}
        />
        
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
        />
        
        <select
          value={formData.type}
          onChange={e => setFormData({ ...formData, type: e.target.value })}
        >
          {['education', 'recreational', 'social', 'diy', 'charity', 'cooking', 'relaxation', 'music', 'busywork'].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        <label>
          <input
            type="checkbox"
            checked={formData.bookingRequired}
            onChange={e => setFormData({ ...formData, bookingRequired: e.target.checked })}
          />
           Booking Required
        </label>
        
        <div>
          <label>Accessibility: {formData.accessibility.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.accessibility}
            onChange={e => setFormData({ ...formData, accessibility: parseFloat(e.target.value) })}
          />
        </div>
        
        <button type="submit">Add Activity</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

// Optimized TodoItem component
const TodoItem = React.memo(({ todo, onDelete }: { todo: Todo; onDelete: (id: string) => void }) => (
  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
    <div>
      <h3>{todo.activity}</h3>
      <p>Price: ${todo.price} | Type: {todo.type} | 
        Accessibility: {todo.accessibility.toFixed(1)} | 
        Booking: {todo.bookingRequired ? 'Yes' : 'No'}
      </p>
    </div>
    <button onClick={() => onDelete(todo.id)}>Delete</button>
  </li>
));