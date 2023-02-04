import React, { useEffect, useState } from 'react'
import './App.css'
import { MdDelete } from 'react-icons/md'
import { ImCheckmark } from 'react-icons/im'

const getLocalTodos = () => {
  let todos = localStorage.getItem('todolist')
  console.log(todos)
  if (todos) {
    return JSON.parse(todos)
  } else {
    return []
  }
}

const getCompLocalTodos = () => {
  let compTodos = localStorage.getItem('completedtodolist')
  console.log(compTodos)
  if (compTodos) {
    return JSON.parse(compTodos)
  } else {
    return []
  }
}

function App() {

  // States 
  const [isCompleteScreen, setIsCompleteScreen] = useState(false)
  const [allTodos, setAllTodos] = useState(getLocalTodos)
  const [inputData, setInputData] = useState({
    title: "",
    description: "",
  })

  const [completedTodos, setCompletedTodos] = useState(getCompLocalTodos)

  // Input Event
  const inputEvent = (event) => {
    const {name, value} = event.target
    setInputData({...inputData, [name]: value})
  }


  // Add todo
  const handleAddTodo = () => {
    setAllTodos([...allTodos, inputData])

    setInputData({
      title: "",
      description: "",
    })
  }

  // Delete todo
  const handleDeleteTodo = (indx) => {
    let reducedTodo = [...allTodos]
    reducedTodo.splice(indx, 1)

    localStorage.setItem('todolist', JSON.stringify(reducedTodo))
    setAllTodos(reducedTodo)
  }

  // Delete completed todo
  const handleDeleteCompletedTodo = (indx) => {
    let completedTodo = [...completedTodos]
    completedTodo.splice(indx, 1)

    localStorage.setItem('todolist', JSON.stringify(completedTodo))
    setCompletedTodos(completedTodo)
  }

  // Todos completed
  const handleComplete = (indx) => {
    let date = new Date()
    let completedOn = date.toLocaleString()
    let filteredItem = {
      ...allTodos[indx],
      completedOn,
    }

    let updatedCompletedArr = [...completedTodos]
    updatedCompletedArr.push(filteredItem)

    handleDeleteTodo(indx)
    setCompletedTodos(updatedCompletedArr)
  }

  useEffect(() => {
    // Add todos to local storage
    localStorage.setItem('todolist', JSON.stringify(allTodos))

    // Add completed todos to local storage
    localStorage.setItem('completedtodolist', JSON.stringify(completedTodos))
  }, [allTodos, completedTodos])

  return (
    <>
      <div className="App">
        <h1>My Todos</h1>
        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input type="text" name="title" value={inputData.title} placeholder="What's the task title?" onChange={inputEvent} />
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input type="text" name="description" value={inputData.description} placeholder="What's the task description?" onChange={inputEvent} />
            </div>
            <div className="todo-input-item">
              <button type="button" className="primaryBtn" onClick={handleAddTodo}>Add</button>
            </div>
          </div>
          <div className="btn-area">
            <button className={`isCompleteScreen ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
            <button className={`isCompleteScreen ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
          </div>
          <div className='todo-list'>
            {isCompleteScreen === false &&
              allTodos.map((item, indx) => {
                return (
                  <div className='todo-list-item' key={indx}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <MdDelete className='icon' onClick={() => handleDeleteTodo(indx)} />
                      <ImCheckmark className='check-icon' onClick={() => handleComplete(indx)} />
                    </div>
                  </div>
                )
              })
            }

            {isCompleteScreen === true &&
              completedTodos.map((item, indx) => {
                return (
                  <div className='todo-list-item' key={indx}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p className="timestamp">Completed on: {item.completedOn}</p>
                    </div>
                    <div>
                      <MdDelete className='icon' onClick={() => handleDeleteCompletedTodo(indx)} />
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
