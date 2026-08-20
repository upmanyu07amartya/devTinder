const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(
      "mongodb+srv://upmanyu07amartya_db_user:8dvNODvBThpGfRYJ@cluster0.n7ipxlh.mongodb.net/devTinder",
    );
};

module.exports = {connectDB}

