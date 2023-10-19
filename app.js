/* eslint-disable no-alert */
const getAllUsers = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'GET',
        })
        if (!response.ok) {
            throw new Error(`Error status ${response.status}`)
        }
        const usersData = await response.json()
        return usersData
    } catch (error) {
        alert(error)
    }
}

const getAllTodos = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'GET',
        })
        if (!response.ok) {
            throw new Error(`Error status ${response.status}`)
        }
        const todosData = await response.json()
        return todosData
    } catch (error) {
        alert(error)
    }
}

const createTodo = async (newTodo) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        if (!response.ok) {
            throw new Error(`Error status ${response.status}`)
        }
        const createdTodoData = await response.json()
        return createdTodoData
    } catch (error) {
        alert(error)
    }
}

const updateTodoStatus = async (updatedTodo) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ completed: updatedTodo.completed }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        if (!response.ok) {
            throw new Error(`Error status ${response.status}`)
        }
        const updatedTodoData = await response.json()
        return updatedTodoData
    } catch (error) {
        alert(error)
    }
}

const deleteTodo = async (todoId) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error(`Error status ${response.status}`)
        }
        const responseData = await response.json()
        return responseData
    } catch (error) {
        alert(error)
    }
}

/**
 * Get a string containing a randomly generated v4 UUID of 36 characters.
 */
// eslint-disable-next-line no-restricted-globals
const getUuid = () => self.crypto.randomUUID()

const deleteTodoElement = async (todo, uuid) => {
    const response = await deleteTodo(todo.id)
    if (response) {
        const todoItems = Array.from(document.querySelectorAll('.todo-item'))
        const todoItemToRm = todoItems.filter((todoItem) => todoItem.dataset.todoId === uuid)[0]
        todoItemToRm.remove()
    }
}

const returnXmark = () => {
    const div = document.createElement('div')
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svgElement.classList.add('close')
    svgElement.setAttribute('viewBox', '0 -960 960 960')
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathElement.setAttribute('d', 'm249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z')
    svgElement.appendChild(pathElement)
    div.appendChild(svgElement)
    return div
}

const changeCompletedStatus = async (e, todo) => {
    // console.log(e.target.dataset.todoId)
    const checkbox = e.target
    checkbox.disabled = true
    const updatedTodo = await updateTodoStatus({ ...todo, completed: checkbox.checked })
    if (!updatedTodo) {
        checkbox.disabled = false
        checkbox.checked = !checkbox.checked
        return
    }
    checkbox.disabled = false
    // console.log(updatedTodo)
}

const createTodoElement = (todo, selectedUserName, prepend = false) => {
    const uuid = getUuid()
    const todoList = document.querySelector('#todo-list')
    const todoItem = document.createElement('li')
    const checkbox = document.createElement('input')
    const contetElement = document.createElement('div')
    const byElement = document.createElement('em')
    const userNameElement = document.createElement('strong')
    const cancelBtn = returnXmark()
    cancelBtn.addEventListener('click', () => deleteTodoElement(todo, `${todo?.id}-${uuid}`))
    checkbox.type = 'checkbox'
    checkbox.checked = todo?.completed
    checkbox.setAttribute('data-todo-id', todo?.id)
    checkbox.addEventListener('click', (e) => changeCompletedStatus(e, todo))
    contetElement.innerText = todo?.title
    byElement.innerText = ' by '
    userNameElement.innerText = selectedUserName
    todoItem.classList.add('todo-item')
    todoItem.setAttribute('data-todo-id', `${todo?.id}-${uuid}`)
    contetElement.appendChild(byElement)
    contetElement.appendChild(userNameElement)
    todoItem.appendChild(checkbox)
    todoItem.appendChild(contetElement)
    todoItem.appendChild(cancelBtn)
    if (prepend) {
        todoList.prepend(todoItem)
        return
    }
    todoList.appendChild(todoItem)
}

const displayAllTodos = (todos = [], users = []) => {
    todos.forEach((todo) => {
        const selectedUserName = users.filter((user) => user?.id === todo?.userId)[0]?.name
        createTodoElement(todo, selectedUserName)
    })
}

const addUsersToOptions = (users = []) => {
    const userTodo = document.querySelector('#user-todo')
    users.forEach((user) => {
        const userOption = document.createElement('option')
        userOption.innerText = user.name
        userOption.value = user.id
        userTodo.appendChild(userOption)
    })
}

const run = async () => {
    const todos = await getAllTodos()
    // console.log(todos)
    const users = await getAllUsers()
    // console.log(users)
    displayAllTodos(todos, users)
    addUsersToOptions(users)

    const newTodoBtn = document.querySelector('form')
    newTodoBtn.addEventListener('submit', async (e) => {
        e.preventDefault()
        const newTodoInput = document.querySelector('#new-todo')
        if (!newTodoInput.value) {
            alert('Укажите задачу')
            return
        }
        const userTodoSelect = document.querySelector('#user-todo')
        const userSelectedOption = userTodoSelect.options[userTodoSelect.selectedIndex]
        if (userSelectedOption.defaultSelected) {
            alert('Выберите пользователя')
            return
        }

        const newTodo = await createTodo({
            completed: false,
            userId: Number(userSelectedOption.value),
            title: newTodoInput.value,
        })
        if (newTodo) {
            // console.log(newTodo)
            const userName = users.filter((user) => user?.id === newTodo?.userId)[0]?.name
            createTodoElement(newTodo, userName, true)
            newTodoInput.value = ''
        }
    })
}

window.addEventListener('load', run)
