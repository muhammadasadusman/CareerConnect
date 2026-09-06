const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same user same job ko dobara save nahi kar sakta
savedJobSchema.index(
  { user: 1, job: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.SavedJob ||
  mongoose.model("SavedJob", savedJobSchema);