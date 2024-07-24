document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#addItem");
  const ul = document.querySelector("#body-container ul");
  const input = document.querySelector("#add");
  const btnDeleteAll = document.querySelector("#deleteAll");
  const btnDeleteComplete = document.querySelector("#deleteCompleted");
  const footerContainer = document.querySelector(".footer-container");

  let localArr = [];
  let editing = false;
  let currentlyEditingTask = null;

  input.value = "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (input.value === "") {
      return;
    }
    let id = new Date().getTime();
    addTask(input.value, id, false);
    localArr.push({
      textTask: input.value,
      isDone: false,
      idTask: id,
    });
    localStorage.setItem("shoppingList", JSON.stringify(localArr));
    input.value = "";
  });

  function addTask(text, id, isDone) {
    let task = document.createElement("li");
    task.innerHTML = `
      <div class="input-container">
          <input class="checkbox ${isDone ? "check" : ""}" id="${id}" type="checkbox" ${isDone ? "checked" : ""}> 
          <label class="checkboxLabel" for="${id}">
              ${text}
          </label> 
      </div>
      <button class="editItem" aria-label="Edit item">
        <i class="fa-solid fa-pencil"></i>
      </button>
      <button class="deleteItem" aria-label="Delete item">
        <i class="fa-solid fa-xmark"></i>
      </button>`;

    ul.append(task);
    deleteTask(task);
    checkTask(task);
    editTask(task);
    checkUl();
  }

  function editTask(task) {
    const editItem = task.querySelector(".editItem");

    editItem.addEventListener("click", function () {
      if (!editing) {
        startEditing(task, editItem);
      } else {
        if (currentlyEditingTask !== task) {
          saveCurrentTask();
          startEditing(task, editItem);
        } else {
          saveCurrentTask();
        }
      }
    });
  }

  function startEditing(task, editItem) {
    editItem.firstElementChild.classList.add("fa-square-check");
    editItem.firstElementChild.classList.remove("fa-pencil");
    editing = true;

    currentlyEditingTask = task;
    const altLabel = task.querySelector("label");
    const altLabelValue = altLabel.innerText;
    let tempInput = `<input type="text" id="edit" value="${altLabelValue}" />`;
    altLabel.innerHTML = tempInput;
    editItem.removeEventListener("click", editTask);
    editItem.addEventListener("click", saveCurrentTask);
  }

  function saveCurrentTask() {
    if (currentlyEditingTask) {
      const editItem = currentlyEditingTask.querySelector(".editItem");
      const altLabel = currentlyEditingTask.querySelector("label");
      const inputValue = currentlyEditingTask.querySelector("input#edit").value;
      const id = currentlyEditingTask.querySelector(".checkbox").id;
      const currentItem = localArr.find((el) => el.idTask === +id);
      currentItem.textTask = inputValue;
      altLabel.innerText = inputValue;
      localStorage.setItem("shoppingList", JSON.stringify(localArr));
      editItem.firstElementChild.classList.add("fa-pencil");
      editItem.firstElementChild.classList.remove("fa-square-check");
      editing = false;
      currentlyEditingTask = null;
    }
  }

  function deleteTask(task) {
    let deleteItem = task.querySelector(".deleteItem");
    deleteItem.addEventListener("click", function () {
      let id = task.querySelector(".checkbox").id;
      localArr = localArr.filter((el) => el.idTask !== +id);
      localStorage.setItem("shoppingList", JSON.stringify(localArr));
      task.remove();
      checkUl();
    });
  }

  function checkTask(task) {
    let check = task.querySelector(".checkbox");
    let id = task.querySelector("input").id;

    check.addEventListener("click", function () {
      check.classList.toggle("check");

      let currentTask = localArr.find((el) => el.idTask === +id);

      if (currentTask) {
        currentTask.isDone = !currentTask.isDone;
      }
      localStorage.setItem("shoppingList", JSON.stringify(localArr));
    });
  }

  function checkUl() {
    if (ul.querySelectorAll("li").length > 0) {
      ul.style.display = "block";
      footerContainer.style.display = "flex";
      footerContainer.style.opacity = "1";
    } else {
      ul.style.display = "none";
      footerContainer.style.display = "none";
      footerContainer.style.opacity = "0";
    }
  }

  btnDeleteAll.addEventListener("click", function () {
    ul.innerHTML = "";
    localStorage.clear();
    checkUl();
  });

  btnDeleteComplete.addEventListener("click", function () {
    let checkedItems = document.querySelectorAll(".check");
    checkedItems.forEach((el) => el.parentElement.parentElement.remove());
    localArr = localArr.filter((el) => el.isDone === false);
    localStorage.setItem("shoppingList", JSON.stringify(localArr));
    checkUl();
  });

  if (localStorage.getItem("shoppingList")) {
    localArr = JSON.parse(localStorage.getItem("shoppingList"));
    localArr.forEach((el) => addTask(el.textTask, el.idTask, el.isDone));
  }
});
