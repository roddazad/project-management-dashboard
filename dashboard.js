let tasks = []; //Will hold all tasks in memory

// 🧠 Select all "Add Task" buttons
const addTaskButtons = document.querySelectorAll(".add-task-btn");

// Loop through each button and add click event
addTaskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const column = button.previousElementSibling; // Gets the correct task-list div

    // Ask user for task text
    const taskText = prompt("Enter task name:");

    if (taskText) {
      // Create the task card
      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");

      // Add content
      taskCard.innerHTML = `<p>${taskText}</p>`;

      // Append to the correct list
      column.appendChild(taskCard);
      taskCard.setAttribute("draggable", "true"); // Make it draggable
      //Add event listeners for drag behavior
      taskCard.addEventListener("dragstart", ()=>{
        taskCard.classList.add("dragging");
      })
      taskCard.addEventListener("dragend", () => {
        taskCard.classList.remove("dragging");
      });
      // Determine column name
        const columnId = column.id.replace("-list", ""); // "todo", "inprogress", "done"

        // Add task to memory array
        tasks.push({
        text: taskText,
        column: columnId,
        });

        // Save to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
          // Allow each task list to accept drops
const taskLists = document.querySelectorAll(".task-list");

    taskLists.forEach((list) => {
        list.addEventListener("dragover", (e) => {
            e.preventDefault(); // Necessary to allow drop
            const draggingCard = document.querySelector(".dragging");
            if (draggingCard) {
            list.appendChild(draggingCard);
            }
        });
    });
  });
});

function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      tasks = JSON.parse(stored); // Load tasks into memory
  
      tasks.forEach((task) => {
        const column = document.getElementById(`${task.column}-list`);
  
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.setAttribute("draggable", "true");
        taskCard.innerHTML = `<p>${task.text}</p>`;
  
        // Add drag behavior
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
  
  //On page load
  loadTasks();

  function updateTaskColumn(taskText, newColumnId) {
    const column = newColumnId.replace("-list", "");
  
    tasks = tasks.map((task) => {
      if (task.text === taskText) {
        return { ...task, column: column };
      }
      return task;
    });
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }