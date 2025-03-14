document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Load tasks from localStorage when the page loads
    loadTasks();

    addTaskBtn.addEventListener("click", () => {
        addTask(taskInput.value.trim(), false);
        taskInput.value = ""; // Clear input
    });

    function addTask(taskValue, isCompleted) {
        if (taskValue === "") return;

        // Create a new list item
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");

        // Checkbox for marking task as completed
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = isCompleted;

        // Task text span
        const taskText = document.createElement("span");
        taskText.textContent = taskValue;
        taskText.classList.add("task-text");
        if (isCompleted) taskText.classList.add("completed");

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏";
        editBtn.classList.add("edit-btn");

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");

        // Append elements
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(editBtn);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        // Save updated tasks to localStorage
        saveTasks();

        // Event listener for marking task as completed
        checkbox.addEventListener("change", function () {
            taskText.classList.toggle("completed", this.checked);
            saveTasks();
        });

        // Event listener for editing task
        editBtn.addEventListener("click", () => editTask(taskText));

        // Event listener for deleting task
        deleteBtn.addEventListener("click", () => {
            taskItem.classList.add("fade-out");
            setTimeout(() => {
                taskItem.remove();
                saveTasks();
            }, 300);
        });
    }

    function editTask(taskText) {
        const currentText = taskText.textContent;
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = currentText;
        inputField.classList.add("edit-input");

        taskText.replaceWith(inputField);
        inputField.focus();

        // Save on "Enter" or when losing focus
        inputField.addEventListener("keypress", (event) => {
            if (event.key === "Enter") saveEdit(inputField, taskText);
        });
        inputField.addEventListener("blur", () => saveEdit(inputField, taskText));
    }

    function saveEdit(inputField, taskText) {
        const newText = inputField.value.trim();
        if (newText === "") return;

        taskText.textContent = newText;
        inputField.replaceWith(taskText);
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".task-item").forEach(taskItem => {
            const taskText = taskItem.querySelector(".task-text").textContent;
            const isCompleted = taskItem.querySelector(".task-checkbox").checked;
            tasks.push({ text: taskText, completed: isCompleted });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => addTask(task.text, task.completed));
    }
});