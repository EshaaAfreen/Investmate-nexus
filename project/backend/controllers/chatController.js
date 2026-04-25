import Message from '../models/Message.js';
import User from '../models/user.js';

export const getChatHistory = async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history', error: error.message });
    }
};

export const getContacts = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`Getting contacts for userId: ${userId}`);

        // Find all messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        });
        console.log(`Found ${messages.length} messages for user.`);

        // Extract unique user IDs from messages
        const contactIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== userId) contactIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== userId) contactIds.add(msg.receiver.toString());
        });

        const contactsList = Array.from(contactIds);
        console.log(`Found contact IDs:`, contactsList);

        // Fetch user details for these contacts
        const contacts = await User.find({
            _id: { $in: contactsList }
        }).select('name email activeRole');

        console.log(`Returned ${contacts.length} contact details.`);

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};
