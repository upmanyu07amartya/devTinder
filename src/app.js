const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.send("Hello from Home Page");
});

app.get("/hello",(req,res)=>{
    res.send("Hello from Hello Page");   // request handler
});


app.listen(3000,()=>{
    console.log('Server is running on PORT 3000');
})