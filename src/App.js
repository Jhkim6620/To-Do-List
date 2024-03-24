import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  };

  // 오늘 날짜 설정
  const today = new Date();
  const formattedToday = formatDate(today);

  // 현재 선택된 날짜와 할 일 목록을 위한 상태
  const [currentDate, setCurrentDate] = useState(today);
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState('');

  // 로컬 스토리지에서 할 일 목록 불러오기
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  // 할 일 목록이 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 날짜 변경 함수
  const changeDate = (offset) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + offset);
      return newDate;
    });
  };

  // 새로운 할 일 추가 함수
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    const dateKey = formatDate(currentDate);
    const updatedTasks = { ...tasks, [dateKey]: [...(tasks[dateKey] || []), { id: Date.now(), text: taskInput, completed: false }] };
    setTasks(updatedTasks);
    setTaskInput('');
  };

  // 할 일 완료 토글 함수
  const handleToggleTask = (taskId) => {
    const dateKey = formatDate(currentDate);
    const updatedTasks = { ...tasks, [dateKey]: tasks[dateKey].map(task => task.id === taskId ? { ...task, completed: !task.completed } : task) };
    setTasks(updatedTasks);
  };

  // 할 일 삭제 함수
  const handleDeleteTask = (taskId) => {
    const dateKey = formatDate(currentDate);
    const updatedTasks = { ...tasks, [dateKey]: tasks[dateKey].filter(task => task.id !== taskId) };
    setTasks(updatedTasks);
  };

  // 현재 선택된 날짜에 맞는 할 일 목록 불러오기
  const currentTasks = tasks[formatDate(currentDate)] || [];

  // 오늘 날짜에 해당하는 부분 강조 함수
  const getHighlightedClass = () => {
    return formatDate(currentDate) === formattedToday ? 'highlighted' : '';
  };

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
