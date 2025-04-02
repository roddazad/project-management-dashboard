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
    }
          // 🧲 Allow each task list to accept drops
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