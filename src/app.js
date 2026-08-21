const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // create a new user instance with the request body data
  try {
    await user.save();  // save it to the database
    res.send("User created Successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

app.get("/user", async(req,res)=>{
  const userEmail = req.body.email;
  try{
    const user = await User.findOne({ email: userEmail });
    if(!user){
      res.status(404).send("User not found");
    }else{
      res.send(user);
    }
  }catch(err){
    res.status(500).send("Error Fetching user");
  }
})

app.get("/users", async(req,res)=>{
  try{
    const users = await User.find() // fetch all users from the database
    res.send(users); 
  }catch(err){
    res.status(500).send("Error fetching users");
  }
})

// Connected to DB and only on successful connection we start the server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on PORT 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
