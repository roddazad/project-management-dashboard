let tasks = []; // Will hold all tasks in memory

// 🔗 Modal Elements
const modal = document.getElementById("task-modal");
const closeModalBtn = document.getElementById("close-modal");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");
const hiddenColumnInput = document.getElementById("task-column");

// 🔘 Show modal
function openModal(columnId) {
  modal.style.display = "block";
  hiddenColumnInput.value = columnId; // Pass column ID to hidden input
}

// ❌ Close modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  taskForm.reset();
});

// 🧠 Select all "Add Task" buttons
const addTaskButtons = document.querySelectorAll(".add-task-btn");

// ✅ Attach click event to each button to open modal
addTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const column = button.previousElementSibling;
    const columnId = column.id.replace("-list", "");
    openModal(columnId); // Only open modal now
  });
});

// ✅ Load tasks from localStorage on page load
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);

    tasks.forEach((task) => {
      const column = document.getElementById(`${task.column}-list`);
      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");
      taskCard.setAttribute("draggable", "true");

      // Build task card content
      taskCard.innerHTML = `
        <p>${task.text}</p>
        <small>Priority: ${task.priority || "medium"}</small><br/>
        ${task.dueDate ? `<small>Due: ${task.dueDate}</small>` : ""}
      `;

      // Drag behavior
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

// ✅ Handle form submission to create new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;
  const columnId = hiddenColumnInput.value;

  if (taskText) {
    const column = document.getElementById(`${columnId}-list`);
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.setAttribute("draggable", "true");

    // Build card content
    taskCard.innerHTML = `
      <p>${taskText}</p>
      <small>Priority: ${priority}</small><br/>
      ${dueDate ? `<small>Due: ${dueDate}</small>` : ""}
    `;

    column.appendChild(taskCard);

    // Drag behavior
    taskCard.addEventListener("dragstart", () => {
      taskCard.classList.add("dragging");
    });

    taskCard.addEventListener("dragend", () => {
      taskCard.classList.remove("dragging");
      updateTaskColumn(taskText, taskCard.parentElement.id);
    });

    // Save task to memory
    tasks.push({ text: taskText, column: columnId, priority, dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Reset form + close modal
  taskForm.reset();
  modal.style.display = "none";
});

// ✅ Update task's column when dropped into new list
function updateTaskColumn(taskText, newColumnId) {
  const column = newColumnId.replace("-list", "");

  tasks = tasks.map((task) => {
    if (task.text === taskText) {
      return { ...task, column };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Allow each task list to accept dropped tasks
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