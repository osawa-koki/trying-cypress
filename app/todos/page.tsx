'use client'

import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaExclamationTriangle, FaInfoCircle, FaTrashAlt } from 'react-icons/fa'
import { CiSaveDown1 } from 'react-icons/ci'

const TODO_KEY = 'todos'

export default function TodosPage (): React.JSX.Element {
  const [todo, setTodo] = useState<string>('')
  const [todos, setTodos] = useState<Array<{ id: string, value: string, tmpValue: string | null }> | null>(null)

  function handleAddTodo (): void {
    if (todos == null) return
    const id = crypto.randomUUID()
    setTodos([...todos, { id, value: todo, tmpValue: null }])
    setTodo('')
  }

  function handleUpdateTodo (id: string): void {
    if (todos == null) return
    const beforeValue = todos.find((t) => t.id === id)?.value
    const afterValue = todos.find((t) => t.id === id)?.tmpValue
    if (beforeValue == null || afterValue == null) return
    setTodos(todos.map((t) => t.id === id ? { ...t, value: afterValue, tmpValue: null } : t))
    toast.success(`Todo updated from '${beforeValue}' to '${afterValue}'`)
  }

  function handleDeleteTodo (index: number): void {
    if (todos == null) return
    setTodos(todos.filter((_, i) => i !== index))
    toast.success('Todo deleted')
  }

  useEffect(() => {
    try {
      const savedTodosString = localStorage.getItem(TODO_KEY)
      if (savedTodosString != null) {
        const savedTodos = JSON.parse(savedTodosString)
        setTodos(savedTodos.map((todo) => ({ id: crypto.randomUUID(), value: todo, tmpValue: null })))
      } else {
        setTodos([])
      }
    } catch (error) {
      console.error(error)
      localStorage.removeItem(TODO_KEY)
      toast.error('Error fetching todos')
    }
  }, [])

  useEffect(() => {
    if (todos == null) return
    localStorage.setItem(TODO_KEY, JSON.stringify(todos.map((todo) => todo.value)))
  }, [todos])

  if (todos == null) {
    return <Spinner />
  }

  return (
    <>
      <div id='Todos'>
        <h1>Here, Todos page.</h1>
        <Form.Group>
          <Form.Label>
            <Form.Control name='create-todo' type='text' placeholder='Enter your todo' value={todo} onChange={(e) => { setTodo(e.target.value) }} />
          </Form.Label>
          <Button type='button' onClick={handleAddTodo} disabled={todo === ''}>Add</Button>
        </Form.Group>
      </div>
      <hr />
      {todos.length !== 0 && (
        <Alert variant='info'>
          <Alert.Heading>
            <FaInfoCircle />
            {' '}
            Info
          </Alert.Heading>
          <p>
            You can edit the todo by double-clicking the todo text.
          </p>
        </Alert>
      )}
      {todos.length !== 0
        ? (
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Todo</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {todo.tmpValue != null
                      ? (
                      <Form.Control name='edit-todo' type='text' value={todo.tmpValue ?? todo.value} onChange={(e) => { setTodos(todos.map((t) => t.id === todo.id ? { ...t, tmpValue: e.target.value } : t)) }} />
                        )
                      : (
                        <div role='button' onDoubleClick={() => { setTodos(todos.map((t) => t.id === todo.id ? { ...t, tmpValue: t.value } : t)) }}>{todo.value}</div>
                        )}
                  </td>
                  <td>
                    <CiSaveDown1 name='save-todo' className={(todo.tmpValue == null || todo.tmpValue === '' || todo.tmpValue === todo.value) ? 'text-secondary' : 'text-success'} role='button' onClick={() => { handleUpdateTodo(todo.id) }} />
                  </td>
                  <td>
                    <FaTrashAlt name='delete-todo' className='text-danger' role='button' onClick={() => { handleDeleteTodo(index) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          )
        : (
        <Alert variant='warning'>
          <Alert.Heading>
            <FaExclamationTriangle />
            {' '}
            Warning
          </Alert.Heading>
          <p>
            No todos found. Please add a todo.
          </p>
        </Alert>
          )}
    </>
  )
}
