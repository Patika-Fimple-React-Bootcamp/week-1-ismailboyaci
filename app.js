import { AlertManager } from './alert.js';

class TodoApp {
    constructor() {
        this.alertManager = new AlertManager();
        // Constants
        this.BASE_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";
        this.LOCAL_KEY = "todo-list-12345";

        // DOM Elements
        this.todoForm = document.querySelector('form');
        this.listContent = document.querySelector('.list-content');
        this.loaderContent = document.querySelector('.loader-content');
        this.themeButton = document.querySelector('.theme-button');
        this.themeImage = document.querySelector('.theme-img');
        this.body = document.querySelector('body');

        // Images
        this.lightImage = "./assets/light.svg";
        this.darkImage = "./assets/dark.svg";

        // State
        this.todoList = [];
        this.statement = {
            isLoading: true,
            isError: false,
            message: '',
            isLight: true
        };

        // Event Listeners
        this.themeButton.addEventListener('click', this.changeTheme.bind(this));
        this.todoForm.addEventListener('submit', this.addNewTodo.bind(this));

        // Initialization
        this.main();
    }

    async fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.setData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    getDatafromLocalStroge() {
        const localData = localStorage.getItem(this.LOCAL_KEY);
        return JSON.parse(localData) || [];
    }

    setDataFromLocalStroge(data) {
        const existData = this.getDatafromLocalStroge();
        existData.push(data);
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(existData));
    }

    checkLocalData() {
        const localData = this.getDatafromLocalStroge();
        if (localData && localData.length > 0) {
            localData.forEach(todo => {
                this.todoList.push(todo);
            })
        }
        this.statement.isLoading = false;
        this.removeLoader();
        this.setHtml();
    }

    setHtml() {
        const listEl = document.querySelector('.todo-list');
        listEl.innerHTML = "";

        this.todoList.forEach(element => {
            const liEl = document.createElement('li');
            liEl.innerHTML = `${element.title}<input type="checkbox" name="check">`;
            liEl.setAttribute('id', element.id);

            const checkbox = liEl.querySelector('input[type="checkbox"]');
            if (element.completed) {
                checkbox.checked = true;
                liEl.classList.add('completed');
            }

            listEl.appendChild(liEl);
            checkbox.addEventListener('change', this.handleCheck.bind(this));
        });
    }

    handleCheck(event) {
        const checkbox = event.target;
        const liElement = checkbox.closest('li');

        if (checkbox.checked) {
            liElement.classList.add('completed');
        } else {
            liElement.classList.remove('completed');
        }
    }

    addNewTodo(event) {
        event.preventDefault();
        const todoTitle = document.getElementById('todo-title').value;
        const todoCompleted = document.getElementById('todo-check').checked;
        if (!todoTitle) { // if todo title is undefined show alert-message 
            this.alertManager.showAlert();
        } else {
            const newTodo = {
                title: todoTitle,
                completed: todoCompleted,
                id: this.todoList.length + 1
            };
            this.setDataFromLocalStroge(newTodo);
            this.todoList.push(newTodo);
            this.setHtml();
            this.todoForm.reset();
        }
    }

    removeLoader() {
        if (this.statement.isLoading === false) {
            setTimeout(() => {
                this.listContent.classList.remove('d-none');
                this.listContent.classList.add('d-block');
                this.loaderContent.classList.add('d-none');
            }, 3500);
        }
    }

    changeTheme() {
        const lightFont = "#31304D";
        const lightBorder = "#161A30";
        const darkFont = "#F0ECE5";
        const darkBorder = "#B6BBC4";
        const ligthBackground = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        const darkBackground = "radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%)"
        if (this.statement.isLight) {
            this.themeImage.setAttribute('src', this.darkImage);
            document.body.style.background = darkBackground;
            document.documentElement.style.setProperty('--font-color', darkFont);
            document.documentElement.style.setProperty('--border-color', darkBorder);
            document.documentElement.style.setProperty('--bg-color', darkBackground);
            this.statement.isLight = false;
            this.body.classList.remove('bg-light');
            this.body.classList.add('bg-dark');
        } else {
            this.themeImage.setAttribute('src', this.lightImage);
            document.body.style.background = ligthBackground;
            document.documentElement.style.setProperty('--font-color', lightFont);
            document.documentElement.style.setProperty('--border-color', lightBorder);
            document.documentElement.style.setProperty('--bg-color', ligthBackground);
            this.statement.isLight = true;
            this.body.classList.remove('bg-dark');
            this.body.classList.add('bg-light');
        }
    }

    setData(data) {
        if (data.length) {
            this.todoList = data;
            this.checkLocalData();
        } else {
            this.statement.isError = true;
            this.statement.message = 'Something is wrong.';
        }
    }

    main() {
        this.fetchData(this.BASE_URL);
    }
}

// Create an instance of the TodoApp class
const todoApp = new TodoApp();
