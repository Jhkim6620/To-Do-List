import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  
/* -----------------------------------변수 섹션----------------------------------- */

  const today = new Date();
  const formattedToday = formatDate(today);
  const [currentDate, setCurrentDate] = useState(today);
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState('');


  
/* -----------------------------------상태 관리 섹션----------------------------------- */
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);





  /* -----------------------------------함수 섹션----------------------------------- */
  const changeDate = (offset) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  };


  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    const dateKey = formatDate(currentDate);
    const updatedTasks = { ...tasks, [dateKey]: [...(tasks[dateKey] || []), { id: Date.now(), text: taskInput, completed: false }] };
    setTasks(updatedTasks);
    setTaskInput('');
  };

  const handleToggleTask = (taskId) => {
    const dateKey = formatDate(currentDate);
    const updatedTasks = { ...tasks, [dateKey]: tasks[dateKey].map(task => task.id === taskId ? { ...task, completed: !task.completed } : task) };
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const dateKey = formatDate(currentDate);
    const updatedTasks = { ...tasks, [dateKey]: tasks[dateKey].filter(task => task.id !== taskId) };
    setTasks(updatedTasks);
  };

  const currentTasks = tasks[formatDate(currentDate)] || [];

  const getHighlightedClass = () => {
    return formatDate(currentDate) === formattedToday ? 'highlighted' : '';
  };




  /* -----------------------------------UI 렌더링 섹션----------------------------------- */
  return (
    <div className="app">
      <div className="date-navigator">
        <button onClick={() => changeDate(-1)}>어제</button>
        <h1 className={getHighlightedClass()}>
          {formatDate(currentDate)}
        </h1>
        <button onClick={() => changeDate(1)}>내일</button>
      </div>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="새 할 일 입력"
        />
        <button type="submit">할 일 추가</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>할 일</th>
            <th>완료</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task.id} className={task.completed ? 'completed' : ''}>
              <td>{task.text}</td>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
              </td>
              <td>
                <button onClick={() => handleDeleteTask(task.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
