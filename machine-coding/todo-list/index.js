const todoInputNode = document.getElementById("todo-input");
const todoCreateBtnNode = document.getElementById("todo-create-btn");
const todoListNode = document.getElementById("todo-list");
const todoInfoNode = document.getElementById("todo-info");

const generateID = (() => {
  let idx = 0;
  return function () {
    idx += 1;
    return `todo-${idx}`;
  };
})();

const todoState = (() => {
  const todoMap = new Map();
  return {
    add(id, text) {
      todoMap.set(id, { text, done: false });
    },
    toggleStatus(id, done) {
      todoMap.get(id).done = done;
    },
    delete(id) {
      todoMap.delete(id);
    },
    getMetaData() {
      const allTodos = Array.from(todoMap.values());
      const completedTodos = allTodos.filter((e) => e.done);

      return {
        completed: completedTodos.length,
        all: allTodos.length,
      };
    },
  };
})();

function updateMetaData() {
  const { completed, all } = todoState.getMetaData();
  todoInfoNode.textContent = `${completed} / ${all} completed`;
}

function reset() {
  todoInputNode.value = "";
  todoCreateBtnNode.disabled = true;
}

function createTodo(value) {
  const id = generateID();
  const wrapper = document.createElement("label");
  wrapper.htmlFor = id;
  wrapper.classList.add("todo-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;

  const label = document.createElement("span");
  label.textContent = value;

  todoState.add(id, value);
  checkbox.addEventListener("change", function (e) {
    const { checked } = e.target;
    todoState.toggleStatus(id, checked);
    updateMetaData();
  });

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  todoListNode.appendChild(wrapper);
  updateMetaData();
  reset();
}

todoInputNode.addEventListener("input", function (e) {
  const { value } = e.target;
  todoCreateBtnNode.disabled = value === "";
});

todoInputNode.addEventListener("keyup", function (e) {
  const { value } = e.target;
  if (e.key === "Enter" && value !== "") {
    createTodo(value);
  }
});

todoCreateBtnNode.addEventListener("click", function () {
  const { value } = todoInputNode;
  if (value === "") return;

  createTodo(value);
});

document.addEventListener("DOMContentLoaded", function () {
  todoInputNode.value = "";
  todoCreateBtnNode.disabled = true;
});
