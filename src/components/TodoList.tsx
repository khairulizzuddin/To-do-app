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
    type: 'Education',
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
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        Todo List 
        <span style={counterStyle}>{todos.length}</span>
      </h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldContainer}>
            <label style={labelStyle}>Activity</label>
            <input
            style={inputStyle}
            type="text"
            placeholder="Enter activity name"
            required
            value={formData.activity}
            onChange={e => setFormData({ ...formData, activity: e.target.value })}
            />
        </div>
        
        <div style={fieldContainer}>
            <label style={labelStyle}>Price</label>
            <input
            style={inputStyle}
            type="number"
            placeholder="Enter amount"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            />
        </div>
        
        <div style={fieldContainer}>
            <label style={labelStyle}>Type</label>
            <select
            style={{ ...inputStyle, padding: '12px' }}
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
            {['Education', 'Recreational', 'Social', 'Diy', 'Charity', 'Cooking', 'Relaxation', 'Music', 'Busywork'].map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
            </select>
        </div>
        
        <label style={checkboxContainer}>
          <input
            type="checkbox"
            checked={formData.bookingRequired}
            onChange={e => setFormData({ ...formData, bookingRequired: e.target.checked })}
            style={checkboxStyle}
          />
          <span style={checkboxLabel}>Booking Required</span>
        </label>
        
        <div style={sliderContainer}>
          <label style={sliderLabel}>
            Accessibility: {formData.accessibility.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.accessibility}
            onChange={e => setFormData({ ...formData, accessibility: parseFloat(e.target.value) })}
            style={sliderStyle}
          />
        </div>
        
        <button type="submit" style={submitButton}>
          Add Activity
        </button>
      </form>

      <ul style={listStyle}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

// Optimized TodoItem component
const TodoItem = React.memo(({ todo, onDelete }: { todo: Todo; onDelete: (id: string) => void }) => (
    <li style={itemStyle}>
      <div style={itemContent}>
        <h3 style={activityStyle}>{todo.activity}</h3>
        <div style={detailsContainer}>
          <span style={detailItem}>${todo.price}</span>
          <span style={detailItem}>{todo.type}</span>
          <span style={detailItem}>{todo.accessibility.toFixed(1)}</span>
          <span style={detailItem}>
            {todo.bookingRequired ? 'Booking Required' : 'No Booking'}
          </span>
        </div>
      </div>
      <button 
        onClick={() => onDelete(todo.id)} 
        style={deleteButton}
      >
        ×
      </button>
    </li>
));

// Styling
const containerStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const headerStyle = {
    color: '#2c3e50',
    fontSize: '2.5rem',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
};
  
const counterStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
};
  
const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    marginBottom: '3rem'
};
  
const inputStyle = {
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
};
  
const checkboxContainer = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
};
  
const checkboxStyle = {
    width: '18px',
    height: '18px',
    accentColor: '#3498db'
};
  
const checkboxLabel = {
    color: '#555',
    fontSize: '0.95rem'
};
  
const sliderContainer = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
};
  
const sliderLabel = {
    color: '#555',
    fontSize: '0.95rem'
};
  
const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#ddd',
    outline: 'none',
};
  
const submitButton = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
};
  
const listStyle = {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
};
  
const itemStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
};
  
const itemContent = {
    flexGrow: 1,
    marginRight: '1rem'
};
  
const activityStyle = {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '1.2rem'
};
  
const detailsContainer = {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap' as const
};
  
const detailItem = {
    backgroundColor: '#f0f0f0',
    color: '#666',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem'
};
  
const deleteButton = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e74c3c',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '0 0.5rem',
    lineHeight: '1',
    transition: 'color 0.3s',
};

const fieldContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem'
};

const labelStyle = {
  color: '#2c3e50',
  fontSize: '0.95rem',
  fontWeight: '500' as const,
  marginLeft: '4px'
};