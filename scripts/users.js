const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/instagram");

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error(err));

(async () => {
  try {
    const genders = ["male", "female"];

    for (let i = 0; i < 100000; i++) {
      await User.create({
        username: `user${i + 1}`,
        fullname: `user ${i + 1}`,
        password: "12345678",
        email: `user${i + 1}@gmail.com`,
        gender: genders[Math.floor(Math.random() * genders.length)],
      });
    }

    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
})();
