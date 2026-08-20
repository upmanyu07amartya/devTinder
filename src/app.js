const express = require("express");
const {connectDB} = require('./config/database');

const app = express();


// Connected to DB and only on successful connection we start the server
connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on PORT 3000");
    });

}).catch(err=>{
    console.error("Database connection failed",err);
})

