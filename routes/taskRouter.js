const {Router} = require("express");
const taskRouter = Router();
const taskController = require("../controllers/taskController");

taskRouter.get("/", taskController.getTasks);
taskRouter.post("/", taskController.addTask);
taskRouter.put("/:id", taskController.updateTask);
taskRouter.delete("/:id", taskController.deleteTask);

module.exports = taskRouter;