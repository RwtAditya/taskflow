//just some checks incase of error
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


//Dom elements 
let tasks = [];
const taskDiv = document.querySelector(".new-Cards");
const titleInput = document.querySelector(".task-input");
const descriptionInput = document.querySelector(".task-textarea");
const dueDateInput = document.querySelector("#dueDate");
const fab = document.querySelector(".fab");
const addSection = document.querySelector(".add-section");
const logout = document.querySelector(".logout-btn");
const addTaskBtn = document.querySelector(".add-btn");

let currentEditingTaskId = null;


//initialization function
async function init() {
    tasks = await getTasks();
    displayTasks(tasks);
}

init();

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


//display on loading dashboard
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
                const para = taskCard.querySelector(".task-item > p");
                if(checkBox.checked){
                    completed.classList.add("task-complete");
                    completed.textContent = "Completed";
                    para.classList.add("complete");
                }
                else{
                    if(completed) {
                        completed.innerHTML="";
                        para.classList.remove("complete");
                    }
                }

            })

            editTask.addEventListener("click", (e) => {
                addSection.classList.toggle("hidden");
                fab.textContent = addSection.classList.contains("hidden") ? "+" : "×";

                loadTaskIntoForm(task);
            })
            taskDiv.appendChild(taskCard);

        })
    }
}


//infomation loading in case of editing task
function loadTaskIntoForm(task) {
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    dueDateInput.value = task.due_date.split("T")[0];

    
    currentEditingTaskId = task.id;

    
    addTaskBtn.textContent = "Update Task";
}



//get tasks api call
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


//create task api call
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

    restForm();

    addSection.classList.add("hidden");
    fab.textContent ="+";
    
}


//update task api call
async function updateTask(taskId){
    // const task = tasks.find(t => t.id === taskId);
    const title = document.querySelector(".task-input").value;
    const description = document.querySelector(".task-textarea").value;
    const status = "pending";
    const category = "Action";
    const due_date = document.querySelector("#dueDate").value;

    const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "authorization" :  `Bearer ${token}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            title: title,
            description: description,
            status: status,
            category: category,
            due_date: due_date
        })
    });

    const data = await res.json();
    
    //updated the task
    tasks = tasks.map(t => t.id === taskId ? data.task : t);

    displayTasks();
    restForm();

    addSection.classList.add("hidden");
    fab.textContent = "+";
}


//delete task api call
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



// Floating button toggle for Add Task form
fab.addEventListener("click", () => {
  addSection.classList.toggle("hidden");

  fab.textContent = addSection.classList.contains("hidden") ? "+" : "×";
});


//logout
logout.addEventListener("click", (e) => {
    localStorage.removeItem("token");

    window.location.href = "/index.html";
})

//form reset
function restForm(){
    titleInput.value ='';
    descriptionInput.value='';
    dueDateInput.value='';
}