const express = require("express");
const { adminAuth } = require("./middlewares/auth");

const app = express();

// Handle Auth Middleware for all requests;
app.use("/admin", adminAuth);
app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data");
})

app.listen(3000,()=>{
    console.log('Server is running on PORT 3000');
})