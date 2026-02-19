import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Topic name is required"],
      trim: true,
      maxlength: [50, "Topic name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    // Reference to the user who owns this topic (can be string for temp users)
    user: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId or string
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user cannot have two topics with the same name
TopicSchema.index({ user: 1, name: 1 }, { unique: true });

const Topic = mongoose.model("Topic", TopicSchema);
export default Topic;
