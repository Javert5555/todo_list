/* eslint-disable no-alert */
/**
 * Fetches all users from https://jsonplaceholder.typicode.com/users
 * @async
 * @function
 * @returns {Promise<Array>} - An array of user objects
 * @throws {Error} - If the response status is not ok
 */
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

/**
 * Fetches all todos from https://jsonplaceholder.typicode.com/todos
 * @async
 * @function
 * @returns {Promise<Array>} - An array of todo objects
 * @throws {Error} - If the response status is not ok
 */
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

/**
 * Creates a new todo on https://jsonplaceholder.typicode.com/todos
 * @async
 * @function
 * @param {Object} newTodo - The todo object to be created
 * @returns {Promise<Object>} - The created todo object
 * @throws {Error} - If the response status is not ok
 */
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

/**
 * Updates the status of a todo on https://jsonplaceholder.typicode.com/todos
 * @async
 * @function
 * @param {Object} updatedTodo - The todo object to be updated
 * @returns {Promise<Object>} - The updated todo object
 * @throws {Error} - If the response status is not ok
 */
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

/**
 * Deletes a todo from https://jsonplaceholder.typicode.com/todos
 * @async
 * @function
 * @param {number} todoId - The id of the todo to be deleted
 * @returns {Promise<Object>} - An empty object
 * @throws {Error} - If the response status is not ok
 */
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

/**
 * Deletes a todo element from the DOM and the server
 * @async
 * @function
 * @param {Object} todo - The todo object to be deleted
 * @param {string} uuid - The unique identifier of the todo element
 * @returns {Promise<void>}
 */
const deleteTodoElement = async (todo, uuid) => {
    const response = await deleteTodo(todo.id)
    if (response) {
        const todoItems = Array.from(document.querySelectorAll('.todo-item'))
        const todoItemToRm = todoItems.filter((todoItem) => todoItem.dataset.todoId === uuid)[0]
        todoItemToRm.remove()
    }
}

/**
 * Returns an SVG element for an X mark
 * @function
 * @returns {HTMLDivElement} - A div element containing an SVG xmark element
 */
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

/**
 * Changes the completed status of a todo on the server
 * @async
 * @function
 * @param {Event} e - The click event
 * @param {Object} todo - The todo object to be updated
 * @returns {Promise<void>}
 */
const changeCompletedStatus = async (e, todo) => {
    const checkbox = e.target
    checkbox.disabled = true
    const updatedTodo = await updateTodoStatus({ ...todo, completed: checkbox.checked })
    if (!updatedTodo) {
        checkbox.disabled = false
        checkbox.checked = !checkbox.checked
        return
    }
    checkbox.disabled = false
}

/**
 * Creates a todo element and appends it to the DOM
 * @function
 * @param {Object} todo - The todo object to be displayed
 * @param {string} selectedUserName - The name of the user who created the todo
 * @param {boolean} [prepend=false] - Whether to prepend the element to the list
 * @returns {void}
 */
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

/**
 * Displays all todos on the page
 * @function
 * @param {Array} [todos=[]] - An array of todo objects
 * @param {Array} [users=[]] - An array of user objects
 * @returns {void}
 */
const displayAllTodos = (todos = [], users = []) => {
    todos.forEach((todo) => {
        const selectedUserName = users.filter((user) => user?.id === todo?.userId)[0]?.name
        createTodoElement(todo, selectedUserName)
    })
}

/**
 * Adds users to the options of a select element.
 *
 * @function
 * @param {Array} users - An array of user objects.
 * @param {string} users[].name - The name of the user.
 * @param {number} users[].id - The ID of the user.
 * @returns {void}
 */
const addUsersToOptions = (users = []) => {
    const userTodo = document.querySelector('#user-todo')
    users.forEach((user) => {
        const userOption = document.createElement('option')
        userOption.innerText = user.name
        userOption.value = user.id
        userTodo.appendChild(userOption)
    })
}

/**
 * Runs the application.
 *
 * @function
 * @async
 * @returns {void}
 */
const run = async () => {
    const todos = await getAllTodos()
    const users = await getAllUsers()
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
            const userName = users.filter((user) => user?.id === newTodo?.userId)[0]?.name
            createTodoElement(newTodo, userName, true)
            newTodoInput.value = ''
        }
    })
}

window.addEventListener('load', run)
