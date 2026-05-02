const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  fileUrl: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subject: {
    type: String,
    default: "General",
    trim: true
  },
  resourceType: {
    type: String,
    default: "Notes",
    enum: ["Notes", "PDF", "Paper", "PPT", "Other"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Resource", resourceSchema);
