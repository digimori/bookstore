import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ISBN: {
      type: Number,
      required: false,
    },
    pageCount: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // This is a creation date
  }
);

export const Book = mongoose.model("Book", bookSchema);
