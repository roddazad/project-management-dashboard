let tasks = []; // Will hold all tasks in memory

// 🧠 Select all "Add Task" buttons
const addTaskButtons = document.querySelectorAll(".add-task-btn");

// Loop through each button and add click event
addTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const column = button.previousElementSibling; // Get the correct task-list div
    const taskText = prompt("Enter task name:");

    if (taskText) {
      // Create the task card
      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");
      taskCard.setAttribute("draggable", "true");
      taskCard.innerHTML = `<p>${taskText}</p>`;

      // Append to the correct list
      column.appendChild(taskCard);

      // Add drag behavior
      taskCard.addEventListener("dragstart", () => {
        taskCard.classList.add("dragging");
      });

      taskCard.addEventListener("dragend", () => {
        taskCard.classList.remove("dragging");
        updateTaskColumn(taskText, taskCard.parentElement.id); // ✅ Save updated column
      });

      // Determine column name (e.g., "todo", "inprogress", "done")
      const columnId = column.id.replace("-list", "");

      // Add task to memory array
      tasks.push({
        text: taskText,
        column: columnId,
      });

      // Save to localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
});

// ✅ Load tasks on page load
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);

    tasks.forEach((task) => {
      const column = document.getElementById(`${task.column}-list`);
      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");
      taskCard.setAttribute("draggable", "true");
      taskCard.innerHTML = `<p>${task.text}</p>`;

      taskCard.addEventListener("dragstart", () => {
        taskCard.classList.add("dragging");
      });

      taskCard.addEventListener("dragend", () => {
        taskCard.classList.remove("dragging");
        updateTaskColumn(task.text, taskCard.parentElement.id);
      });

      column.appendChild(taskCard);
    });
  }
}

loadTasks(); // 👈 Run this on page load

// ✅ Update task's column when it's dropped
function updateTaskColumn(taskText, newColumnId) {
  const column = newColumnId.replace("-list", ""); // Remove '-list' suffix
  tasks = tasks.map((task) => {
    if (task.text === taskText) {
      return { ...task, column: column };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Set up dragover listeners for each task list (only once)
const taskLists = document.querySelectorAll(".task-list");

taskLists.forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    const draggingCard = document.querySelector(".dragging");
    if (draggingCard) {
      list.appendChild(draggingCard);
    }
  });
});