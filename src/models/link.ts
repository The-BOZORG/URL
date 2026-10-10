import mongoose from "mongoose";
import { Schema } from "mongoose";

const linkSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Url: {
      type: String,
      required: true,
    },

    shortLink: {
      type: String,
      required: true,
      unique: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Link = mongoose.model("User", linkSchema);
