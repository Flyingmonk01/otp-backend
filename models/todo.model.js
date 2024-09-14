import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        time: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default Todo = mongoose.model("todo", todoSchema);
