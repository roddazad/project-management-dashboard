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
  modal.classList.add("show");
  modal.style.display = "block";
  hiddenColumnInput.value = columnId;
}

// ❌ Close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.style.display = "none";
  taskForm.reset();
});

// ➕ Handle + Add Task button clicks
const addTaskButtons = document.querySelectorAll(".add-task-btn");
addTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const column = button.previousElementSibling;
    const columnId = column.id.replace("-list", "");
    openModal(columnId);
  });
});

// ✅ Load tasks from localStorage
function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    tasks.forEach((task) => renderTask(task.text, task.column, task.priority, task.dueDate));
  }
}

loadTasks();

// 🧠 Handle form submit
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;
  const columnId = hiddenColumnInput.value;

  if (taskText) {
    renderTask(taskText, columnId, priority, dueDate);

    tasks.push({ text: taskText, column: columnId, priority, dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  taskForm.reset();
  modal.style.display = "none";
});
function getDueClass(dateString) {
    const today = new Date();
    const dueDate = new Date(dateString);
  
    // Zero out time for comparison
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
  
    if (dueDate < today) return "due-overdue"; // Past date
    if (dueDate.getTime() === today.getTime()) return "due-today"; // Today
    return "due-upcoming"; // Future
  }

// 🔁 Render Task Card (used for both loading + creating)
function renderTask(taskText, columnId, priority, dueDate) {
  const column = document.getElementById(`${columnId}-list`);
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");
  taskCard.setAttribute("draggable", "true");

  // Task card structure
  taskCard.innerHTML = `
    <div class="task-header">
      <p>${taskText}</p>
      <div class="task-actions">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      </div>
    </div>
    <span class="priority-label ${priority}">${priority}</span>
    ${
        dueDate
          ? `<small class="${getDueClass(dueDate)}">Due: ${dueDate}</small>`
          : ""
      }
  `;

  column.appendChild(taskCard);
  taskCard.style.opacity = "0";
  setTimeout(() => {
  taskCard.style.transition = "opacity 0.4s ease";
  taskCard.style.opacity = "1";
}, 10);

  // Drag functionality
  taskCard.addEventListener("dragstart", () => {
    taskCard.classList.add("dragging");
  });

  taskCard.addEventListener("dragend", () => {
    taskCard.classList.remove("dragging");
    updateTaskColumn(taskText, taskCard.parentElement.id);
  });

  // 🗑 DELETE
  taskCard.querySelector(".delete-btn").addEventListener("click", () => {
    const taskTextEl = taskCard.querySelector("p").innerText;
    taskCard.remove();
    tasks = tasks.filter(task => task.text !== taskTextEl);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  // ✏️ EDIT
  taskCard.querySelector(".edit-btn").addEventListener("click", () => {
    const taskTextEl = taskCard.querySelector("p").innerText;
    const taskData = tasks.find(task => task.text === taskTextEl);

    if (taskData) {
      taskInput.value = taskData.text;
      prioritySelect.value = taskData.priority || "medium";
      dueDateInput.value = taskData.dueDate || "";
      hiddenColumnInput.value = taskData.column;

      taskCard.remove();
      tasks = tasks.filter(task => task.text !== taskTextEl);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      modal.style.display = "block";
    }
  });
}

// ✅ Update task column after dragging
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

// ✅ Make task lists accept dragged tasks
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