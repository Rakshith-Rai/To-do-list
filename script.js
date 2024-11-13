const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDatetime = document.getElementById('todo-datetime');
const todoList = document.getElementById('todo-list');

// Load existing to-dos from localStorage
document.addEventListener('DOMContentLoaded', loadTodos);

todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    const dueDate = todoDatetime.value;  // Get the date/time value

    if (todoText && dueDate) {
        addTodo(todoText, dueDate);
        todoInput.value = '';  // Clear input
        todoDatetime.value = '';  // Clear date/time input
    }
});

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        createTodoElement(todo.text, todo.done, todo.dueDate);
        if (todo.dueDate) {
            setReminder(todo.text, todo.dueDate);
        }
    });
}

function addTodo(todoText, dueDate) {
    const todo = { text: todoText, done: false, dueDate: dueDate };
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    createTodoElement(todoText, false, dueDate);

    // Set reminder
    if (dueDate) {
        setReminder(todoText, dueDate);
    }
}

function createTodoElement(todoText, done = false, dueDate) {
    const li = document.createElement('li');
    li.classList.toggle('done', done);
    const dateFormatted = dueDate ? new Date(dueDate).toLocaleString() : 'No due date';

    li.innerHTML = `
        <span class="todo-text">${todoText}</span>
        <span class="due-date">Due: ${dateFormatted}</span>
        <button class="delete-btn" onclick="deleteTodo(event)">Delete</button>
        <input type="checkbox" class="done-checkbox" ${done ? 'checked' : ''} onclick="toggleDone(event)">
    `;

    todoList.appendChild(li);
}

function deleteTodo(event) {
    const todoItem = event.target.parentElement;
    const todoText = todoItem.querySelector('.todo-text').textContent;
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedTodos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    todoItem.remove();
}

function toggleDone(event) {
    const checkbox = event.target;
    const todoItem = checkbox.parentElement;
    const todoText = todoItem.querySelector('.todo-text').textContent;
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todo = todos.find(todo => todo.text === todoText);
    todo.done = checkbox.checked;
    localStorage.setItem('todos', JSON.stringify(todos));
    todoItem.classList.toggle('done', todo.done);
}

// Set reminder for the task
function setReminder(todoText, dueDate) {
    const dueTime = new Date(dueDate).getTime();
    const now = new Date().getTime();
    const timeRemaining = dueTime - now;

    // If the due time is in the future
    if (timeRemaining > 0) {
        setTimeout(() => {
            alert(`Reminder: ${todoText} is due now!`);
        }, timeRemaining);
    }
}
