const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.send("Hello from Home Page");
});

app.get("/user",(req,res)=>{
    res.send({firstName:"Amartya",lastName:"Upmanyu"});
})

app.post("/user",(req,res)=>{
    res.send("User created");
});

app.listen(3000,()=>{
    console.log('Server is running on PORT 3000');
})