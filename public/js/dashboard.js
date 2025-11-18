const token = localStorage.getItem("token");
if(!token){
    window.location.href = "/login";
    throw new Error("No token found");
}

let payload;
try{
    payload = JSON.parse(atob(token.split(".")[1]));
}catch(err){
    console.error("Failed to decode token", err);
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw err;
}

let tasks = [];
const taskDiv = document.querySelector(".new-Cards");
const titleInput = document.querySelector(".task-input");
const descriptionInput = document.querySelector(".task-textarea");
const dueDateInput = document.querySelector("#dueDate");
let currentEditingTaskId = null;


async function init() {
    tasks = await getTasks();
    displayTasks(tasks);
}

init();

const addTaskBtn = document.querySelector(".add-btn");
addTaskBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if(currentEditingTaskId) {
        await updateTask(currentEditingTaskId);
        currentEditingTaskId = null;
        addTaskBtn.textContent = "Add Task";
    }
    else{
        await createTask();
    }
})

function displayTasks(){
    if(tasks.length === 0) {
        taskDiv.innerHTML = "";
        const noTask = document.createElement("p");
        noTask.classList.add("notaskmsg");
        noTask.textContent = "No Task Created";

        taskDiv.appendChild(noTask);
    }
    else{
        taskDiv.innerHTML="";
        tasks.forEach(task => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-item");

            taskCard.innerHTML = `<span class="task-dot"></span>
                <input type="checkbox" id="checkbox" name="checkbox">
                <p>${task.title}</p><span class="task-status"></span>
                <button class="edit-task">Edit</button>
                <button class="delete-task">✕</button>`;
            
            
            const delTask = taskCard.querySelector(".delete-task");
            const checkBox = taskCard.querySelector("#checkbox");
            const editTask = taskCard.querySelector(".edit-task");


            delTask.addEventListener("click", async (e)=>{
                deleteTask(task.id);
            })

            checkBox.addEventListener("change", (e) => {
                const completed = taskCard.querySelector(".task-status");
                if(checkBox.checked){
                    completed.textContent = "Completed";
                }
                else{
                    if(completed) completed.innerHTML="";
                }

            })

            editTask.addEventListener("click", (e) => {
                loadTaskIntoForm(task);
            })
            taskDiv.appendChild(taskCard);

        })
    }
}

function loadTaskIntoForm(task) {

    titleInput.value = task.title;
    descriptionInput.value = task.description;
    dueDateInput.value = task.due_date.split("T")[0];

    
    currentEditingTaskId = task.id;

    
    addTaskBtn.textContent = "Update Task";
}

async function getTasks() {
    const res = await fetch("/api/tasks", {
        method: "GET",
        headers: {
            "authorization" : `Bearer ${token}`
        }
    }) 

    const data = await res.json();
    return data.tasks;
}



async function createTask() {
    const title = document.querySelector(".task-input").value;
    const description = document.querySelector(".task-textarea").value;
    const status = "pending";
    const category = "Action";
    const due_date = document.querySelector("#dueDate").value;

    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "authorization" :  `Bearer ${token}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            title:title,
            description:description,
            status:status,
            category:category,
            due_date:due_date,
        })
    })
    
    const data = await res.json();
    const task = data.task;

    //added the new task
    tasks.unshift(task);
    displayTasks();
    
}

async function updateTask(taskId){
    const task = tasks.find(t => t.id === taskId);

    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "authorization" :  `Bearer ${token}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            title: task.title,
            description: task.description,
            status: task.status,
            category: task.category,
            due_date: task.due_date
        })
    });

    const data = await res.json();
    
    //updated the task
    tasks = tasks.map(t => t.id === taskId ? data.task : t);

    displayTasks();
}

async function deleteTask(taskId) {
    const task = tasks.filter(task => task.id === taskId);

    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            "authorization" :  `Bearer ${token}`,
            "Content-Type" : "application/json"
        },
    });

    if (currentEditingTaskId === taskId) {
        currentEditingTaskId = null;
        addTaskBtn.textContent = "Add Task";
    }

    //refresh dashboard 
    tasks = tasks.filter(t => t.id !== taskId);
    displayTasks();
}