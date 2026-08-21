const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // create a new user instance with the request body data
  
  try {
    if (req.body.skills.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    await user.save();  // save it to the database
    res.send("User created Successfully");
  } catch(err) {
    res.status(500).send(err.message);
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

app.delete("/user", async(req,res)=>{
  const userId = req.body.id;
  try{
    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deletedUser){
      res.status(404).send("User not found");
    }else{
      res.send("User deleted successfully");
    }
  }catch(err){
    res.status(500).send("Error deleting user");
  }
})

app.patch("/user/:userId", async(req,res)=>{
  const userId = req.params?.userId;
  const data = req.body;
  try{
    const allowedUpdates = ["password", "description","profileImageUrl","skills","age","gender"]
    const isUpdateAllowed = Object.keys(data).every((key)=>allowedUpdates.includes(key));
    if(!isUpdateAllowed){
      throw new Error("Invalid Updates: One of the field you are trying to update is not allowed.")
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    const updatedUser = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "after", runValidators:true });
    if(!updatedUser){
      res.status(404).send("User not found");
    }else{
      res.send("User updated successfully", updatedUser);
    }
  }catch(err){
    res.status(500).send(err.message);
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
