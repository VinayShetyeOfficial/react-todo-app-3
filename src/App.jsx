/**
 * Todo Application main component
 *
 * Features:
 * - Manages todo items and completed todos
 * - Persists data in localStorage
 * - Handles adding, completing, and deleting todos
 */

import React, { useEffect, useState } from "react";
import "./App.css";
import { MdDelete, MdPendingActions } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import initialTodos from "./data/todos";

/**
 * Retrieves todos from localStorage or initializes with default todos
 * @returns {Array} Array of todo items
 */
const getLocalTodos = () => {
  let todos = localStorage.getItem("todolist");
  if (todos) {
    return JSON.parse(todos);
  }
  // Initialize with first three default todos
  const firstThreeTodos = initialTodos.slice(0, 3);
  localStorage.setItem("todolist", JSON.stringify(firstThreeTodos));
  return firstThreeTodos;
};

/**
 * Retrieves completed todos from localStorage
 * @returns {Array} Array of completed todo items
 */
const getCompLocalTodos = () => {
  let compTodos = localStorage.getItem("completedtodolist");
  return compTodos ? JSON.parse(compTodos) : [];
};

/**
 * Main App component handling todo functionality
 */
function App() {
  // State management
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState(getLocalTodos);
  const [inputData, setInputData] = useState({
    title: "",
    description: "",
  });
  const [completedTodos, setCompletedTodos] = useState(getCompLocalTodos);

  /**
   * Handles input changes for todo form
   * @param {Event} event - Input change event
   */
  const inputEvent = (event) => {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  };

  /**
   * Adds new todo to the list
   */
  const handleAddTodo = () => {
    if (!inputData.title.trim() || !inputData.description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    const newTodos = [...allTodos, inputData];
    setAllTodos(newTodos);
    localStorage.setItem("todolist", JSON.stringify(newTodos));
    setInputData({ title: "", description: "" });
  };

  // Delete todo
  const handleDeleteTodo = (indx) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(indx, 1);
    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setAllTodos(reducedTodo);
  };

  // Delete completed todo
  const handleDeleteCompletedTodo = (indx) => {
    let completedTodo = [...completedTodos];
    completedTodo.splice(indx, 1);
    localStorage.setItem("completedtodolist", JSON.stringify(completedTodo));
    setCompletedTodos(completedTodo);
  };

  // Mark todo as completed
  const handleComplete = (indx) => {
    let date = new Date();
    let completedOn = date.toLocaleString();
    let filteredItem = { ...allTodos[indx], completedOn };

    let updatedCompletedArr = [...completedTodos, filteredItem];

    handleDeleteTodo(indx);
    setCompletedTodos(updatedCompletedArr);
    localStorage.setItem(
      "completedtodolist",
      JSON.stringify(updatedCompletedArr)
    );
  };

  // Add this after the handleComplete function
  const handlePending = (indx) => {
    let pendingItem = { ...completedTodos[indx] };
    // Remove the completedOn property
    delete pendingItem.completedOn;

    // Add to todos list
    let updatedTodos = [...allTodos, pendingItem];
    setAllTodos(updatedTodos);
    localStorage.setItem("todolist", JSON.stringify(updatedTodos));

    // Remove from completed list
    handleDeleteCompletedTodo(indx);
  };

  useEffect(() => {
    // Sync state with local storage
    localStorage.setItem("todolist", JSON.stringify(allTodos));
    localStorage.setItem("completedtodolist", JSON.stringify(completedTodos));
  }, [allTodos, completedTodos]);

  return (
    <div className="App">
      <h1 className="title">My Todos</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={inputData.title}
              placeholder="What's the task title?"
              onChange={inputEvent}
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={inputData.description}
              placeholder="What's the task description?"
              onChange={inputEvent}
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              className="primaryBtn"
              onClick={handleAddTodo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`isCompleteScreen ${!isCompleteScreen && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`isCompleteScreen ${isCompleteScreen && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
          {!isCompleteScreen &&
            allTodos.map((item, indx) => (
              <div className="todo-list-item" key={indx}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <ImCheckmark
                    className="icon check-icon"
                    onClick={() => handleComplete(indx)}
                  />
                  <MdDelete
                    className="icon delete-icon"
                    onClick={() => handleDeleteTodo(indx)}
                  />
                </div>
              </div>
            ))}

          {isCompleteScreen &&
            completedTodos.map((item, indx) => (
              <div className="todo-list-item" key={indx}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className="timestamp">Completed on: {item.completedOn}</p>
                </div>
                <div>
                  <MdPendingActions
                    className="icon pending-icon"
                    onClick={() => handlePending(indx)}
                  />
                  <MdDelete
                    className="icon delete-icon"
                    onClick={() => handleDeleteCompletedTodo(indx)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
