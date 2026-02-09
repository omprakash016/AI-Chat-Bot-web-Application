const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true,
        // sparse: true, // Not strictly necessary if you have a default, but okay to keep
        default: uuidv4 // simplified syntax
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now // Fixed typo: defualt -> default
    },
    updatedAt: {
        type: Date,
        default: Date.now // Fixed typo: defualt -> default
    }
});

// REMOVED: ThreadSchema.index(...) - This was causing the "Duplicate schema index" warning

module.exports = mongoose.model("Thread", ThreadSchema);