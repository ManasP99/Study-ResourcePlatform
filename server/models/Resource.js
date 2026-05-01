const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String
});

module.exports = mongoose.model("Resource", resourceSchema);
