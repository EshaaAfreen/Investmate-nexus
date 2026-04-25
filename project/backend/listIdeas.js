import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const IdeaSchema = new mongoose.Schema({
    title: String,
    files: Object
});
const Idea = mongoose.model('Idea', IdeaSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const searchId = "6960a6ce927446735b0b8a27";
        const idea = await Idea.findById(searchId);
        if (!idea) {
            console.log(`Idea with ID ${searchId} NOT FOUND`);
            const count = await Idea.countDocuments();
            console.log(`Total ideas in DB: ${count}`);
        } else {
            console.log("Idea FOUND:", idea.title);
            console.log("Files:", idea.files ? Object.keys(idea.files) : "None");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
