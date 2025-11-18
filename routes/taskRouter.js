const {Router} = require("express");
const taskRouter = Router();
const taskController = require("../controllers/taskController");

taskRouter.get("/", taskController.getTasks);
taskRouter.post("/", taskController.addTasks);
taskRouter.put("/:id", taskController.updateTasks);
taskRouter.delete("/:id", taskController.deleteTasks);

module.exports = taskRouter;