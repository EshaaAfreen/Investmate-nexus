// User roles
export const USER_ROLES = {
  ENTREPRENEUR: 'entrepreneur',
  INVESTOR: 'investor'
};

// Idea status values
export const IDEA_STATUS = {
  PENDING: 'pending',
  VALIDATED: 'validated',
  REVISION: 'revision',
  REJECTED: 'rejected'
};

// Helper functions for type checking (optional, for runtime validation)
export const createUser = (id, name, email, role) => ({
  id,
  name,
  email,
  role
});

export const createIdea = (data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  market: data.market,
  problem: data.problem,
  solution: data.solution,
  status: data.status,
  entrepreneurId: data.entrepreneurId,
  entrepreneurName: data.entrepreneurName,
  feedback: data.feedback || [],
  documents: data.documents || [],
  createdAt: data.createdAt
});

export const createInvestment = (id, ideaId, ideaTitle, amount, date, status) => ({
  id,
  ideaId,
  ideaTitle,
  amount,
  date,
  status
});

export const createMessage = (id, senderId, senderName, content, timestamp) => ({
  id,
  senderId,
  senderName,
  content,
  timestamp
});

export const createConversation = (id, participantId, participantName, lastMessage, timestamp, messages = []) => ({
  id,
  participantId,
  participantName,
  lastMessage,
  timestamp,
  messages
});