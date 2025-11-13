const {Router} = require("express");
const userRouter = Router();
const authController = require("../controllers/authController");

userRouter.post("/login", authController.loginUser);
userRouter.post("/register", authController.registerUser);


module.exports = userRouter;