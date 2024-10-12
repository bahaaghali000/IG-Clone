const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_LOCAL);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
})()

