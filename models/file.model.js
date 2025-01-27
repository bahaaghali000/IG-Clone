const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
