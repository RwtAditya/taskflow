const Tasks = require("../models/taskModel");
const jwt = require("jsonwebtoken");

exports.getTasks = async (req, res) => {
    const userId  = req.user.userId;
    try{
        const tasks = await Tasks.getTasks(userId);
        
        return res.status(200).json({message: "Success",tasks: tasks});

    }catch(err){
        console.error("Error fetching tasks: ", err.stack);
        return res.status(500).json({message: "Internal server error"});
    }

}

exports.addTasks = async (req, res) => {
    const userId = req.user.userId;
    const {title,description,category,due_date,status} = req.body;

    try{
        const task = await Tasks.createTask(userId, title, description, category,due_date, status);
        return res.status(200).json({message: "Success", task:task});

    }catch(err){
        console.error("Error creating task", err.stack);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

exports.updateTasks = async (req, res) => {
    const userId = req.user.userId;
    const {taskId, title, description, category,due_date, status} = req.body;

    try{
        const updateTask = await Tasks.updateTask(taskId,userId, title, description, category,due_date, status);
        
        if(!updateTask){
            return res.status(403).json({message: "Not allowed to update tasks"});
        }

        return res.status(200).json({message: "Success", task:updateTask});

    }catch(err){
        console.error("Error updating task", err.stack);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


exports.deleteTasks = async (req, res) => {
    const userId = req.user.userId;
    const {taskId} = req.body;

    try{
        const deleteTask = await Tasks.deleteTask(taskId, userId);

        if(deleteTask === 0){
            return res.status(404).json({message: "Task not found or not allowed"});
        }
        return res.status(200).json({message: "Task Deleted"});

    }catch(err){
        console.error("Error Deleting task", err.stack);
        return res.status(500).json({message: "Internal Server Error"});
    }
}