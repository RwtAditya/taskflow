const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();



app.use("/", (req,res) => {
    res.send("Hello World!");
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
    if(error) {
        throw error;
    }
    console.log(`Server is running at port ${PORT}`);
})