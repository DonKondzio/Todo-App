"use strict";

const body = document.body;
const sunImg = document.querySelector(".theme-toggle-img--sun");
const moonImg = document.querySelector(".theme-toggle-img--moon");
const createInput = document.querySelector(".create-input");
const todoItemsContainer = document.querySelector(".todo-items-container");
const todoBottom = document.querySelector(".todo-bottom");
const markButtons = document.querySelectorAll(".todo-item-circle");
// const todoItems = document.querySelectorAll(".todo-item-circle");
const filterBtns = document.querySelectorAll(".filter-btn");
const showAllBtns = document.querySelectorAll(".filter-btn--all");
const showActiveBtns = document.querySelectorAll(".filter-btn--active");
const showCompletedBtns = document.querySelectorAll(".filter-btn--completed");
const clearCompletedBtn = document.querySelector(".todo-bottom-clear");

class ThemeToggler {
  constructor() {
    document.documentElement.setAttribute("data-theme", `dark`);
    [sunImg, moonImg].forEach((el) =>
      el.addEventListener("click", this.changeTheme)
    );
  }
  // [sunImg,moonImg].forEach(el => el.addEventListener(() => console.log('hi')));

  changeTheme() {
    [sunImg, moonImg].forEach((el) => el.classList.toggle("active"));
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const themeToSet =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    body.classList.toggle("light");

    document.documentElement.setAttribute("data-theme", `${themeToSet}`);
  }
}

class TodoApp {
  todoItems = [];
  currentId = 0;
  draggedItem;
  constructor() {
    const themeToggler = new ThemeToggler();
    createInput.addEventListener("keyup", this.addTodoItem.bind(this));
    // markButtons.forEach((btn) =>
    //   btn.addEventListener("click", this.markItem.bind(this))
    // );
    todoItemsContainer.addEventListener("click", this.markItem);
    todoItemsContainer.addEventListener("click", this.removeItem.bind(this));
    todoItemsContainer.addEventListener("dragstart", this.dragInit.bind(this));
    todoItemsContainer.addEventListener("dragover", this.dragOver.bind(this));
    todoItemsContainer.addEventListener("dragend", this.dragEnd.bind(this));
    showAllBtns.forEach((btn) =>
      btn.addEventListener("click", this.showAll.bind(this))
    );
    showActiveBtns.forEach((btn) =>
      btn.addEventListener("click", this.showActive.bind(this))
    );
    showCompletedBtns.forEach((btn) =>
      btn.addEventListener("click", this.showCompleted.bind(this))
    );
    clearCompletedBtn.addEventListener("click", this.clearCompleted.bind(this));
  }

  addTodoItem(e) {
    if (e.key !== "Enter" || createInput.value === "") return;
    this.currentId++;
    const todoContent = createInput.value;
    createInput.value = "";

    const html = `
    <div data-id="${this.currentId}" class="todo-item" draggable="true">
    <div class="todo-item-left">
    <button class="todo-item-circle">
            <img
            src="dist/img/icon-check.svg"
            alt="checkmark"
            class="todo-item-circle-check"
            />
            <div class="todo-item-circle-gradient"></div>
            </button>
            <p class="todo-item-text">${todoContent}</p>
        </div>
        <button class="todo-item-close">
        <img
        class="todo-item-close-img"
        src="dist/img/icon-cross.svg"
        alt="cross"
        />
        </button>
        </div>
        `;
    todoBottom.insertAdjacentHTML("beforebegin", html);

    const newTodoItem = document.querySelector(`[data-id="${this.currentId}"]`);
    this.todoItems.push(newTodoItem);
  }

  markItem(e) {
    if (!e.target.closest("button")) return;
    if (e.target.closest("button").classList.contains("todo-item-circle"))
      e.target.closest(".todo-item").classList.toggle("completed");
  }

  removeItem(e) {
    if (!e.target.closest("button")) return;
    const todoItem = e.target.closest(".todo-item");
    if (e.target.closest("button").classList.contains("todo-item-close")) {
      todoItemsContainer.removeChild(todoItem);
      this.todoItems.splice(this.todoItems.indexOf(todoItem), 1);
    }
  }

  showAll() {
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    showAllBtns.forEach((btn) => btn.classList.add("active"));
    this.todoItems.forEach((item) => item.classList.remove("hidden"));
  }

  showActive() {
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    showActiveBtns.forEach((btn) => btn.classList.add("active"));
    this.todoItems.forEach((item) => {
      item.classList.contains("completed")
        ? item.classList.add("hidden")
        : item.classList.remove("hidden");
    });
  }

  showCompleted() {
    filterBtns.forEach((btn) => btn.classList.remove("active"));
    showCompletedBtns.forEach((btn) => btn.classList.add("active"));
    this.todoItems.forEach((item) => {
      item.classList.contains("completed")
        ? item.classList.remove("hidden")
        : item.classList.add("hidden");
    });
  }

  renderView() {
    const currentDOMItems = Array.from(document.querySelectorAll(".todo-item"));
    currentDOMItems.forEach((item) => {
      if (!this.todoItems.includes(item)) {
        todoItemsContainer.removeChild(item);
      }
    });
  }

  clearCompleted() {
    this.todoItems = this.todoItems.filter(
      (item) => !item.classList.contains("completed")
    );
    this.renderView();
  }

  dragInit(e) {
    this.draggedItem = e.target.closest(".todo-item");
    this.draggedItem.classList.add("dragging");
  }

  dragOver(e) {
    // Allow dragging only if the target is a todo-item
    const todoItem = e.target.closest(".todo-item");
    if (!todoItem) return;

    const todoItemRect = todoItem.getBoundingClientRect(); // item rect info

    const offset = e.clientY - todoItemRect.top; // distance between cursor and top of todo item
    const threshold = todoItemRect.height / 2; // half of item height

    if (offset > threshold) {
      todoItemsContainer.insertBefore(
        this.draggedItem,
        todoItem.nextElementSibling
      );
    } else todoItemsContainer.insertBefore(this.draggedItem, todoItem);
  }

  dragEnd(e) {
    this.draggedItem.classList.remove("dragging");
    this.draggedItem = "";
  }
}

const todoApp = new TodoApp();
