import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver
    type: { type: String, enum: ["upload", "verification", "alert"], required: true },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g., IdeaId or DocId
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model("Notification", NotificationSchema);
