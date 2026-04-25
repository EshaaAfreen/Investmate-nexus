export const mockIdeas = [
  {
    id: '1',
    title: 'EcoTrack - Carbon Footprint App',
    description: 'Mobile app to track personal carbon footprint',
    market: 'Environmental Technology',
    problem: 'People are unaware of their daily carbon emissions',
    solution: 'Gamified app that tracks and suggests eco-friendly alternatives',
    status: 'validated',
    entrepreneurId: '1',
    entrepreneurName: 'John Doe',
    feedback: ['Strong market potential', 'Clear value proposition'],
    documents: ['business-plan.pdf', 'market-research.pdf'],
    createdAt: '2024-09-15'
  },
  {
    id: '2',
    title: 'HealthConnect - Telemedicine Platform',
    description: 'Connect patients with doctors remotely',
    market: 'Healthcare Technology',
    problem: 'Limited access to healthcare in rural areas',
    solution: 'Video consultation platform with prescription delivery',
    status: 'pending',
    entrepreneurId: '1',
    entrepreneurName: 'John Doe',
    feedback: [],
    createdAt: '2024-09-20'
  },
  {
    id: '3',
    title: 'EduLearn - AI Tutor',
    description: 'AI-powered personalized learning assistant',
    market: 'EdTech',
    problem: 'Students struggle with one-size-fits-all learning',
    solution: 'Adaptive AI tutor that personalizes content and pace',
    status: 'revision',
    entrepreneurId: '1',
    entrepreneurName: 'John Doe',
    feedback: ['Need clearer monetization strategy', 'Expand on AI capabilities'],
    createdAt: '2024-09-10'
  }
];

export const mockInvestments = [
  {
    id: '1',
    ideaId: '1',
    ideaTitle: 'EcoTrack - Carbon Footprint App',
    amount: 50000,
    date: '2024-09-25',
    status: 'Active'
  },
  {
    id: '2',
    ideaId: '4',
    ideaTitle: 'FoodShare - Surplus Food Distribution',
    amount: 30000,
    date: '2024-08-15',
    status: 'Active'
  }
];

export const mockConversations = [
  {
    id: '1',
    participantId: '2',
    participantName: 'Sarah Johnson',
    lastMessage: 'Looking forward to discussing the investment terms',
    timestamp: '2024-09-28 14:30',
    messages: [
      {
        id: '1',
        senderId: '2',
        senderName: 'Sarah Johnson',
        content: 'Hi! I\'m interested in your EcoTrack project.',
        timestamp: '2024-09-28 10:00'
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'You',
        content: 'Thank you for your interest! Happy to discuss.',
        timestamp: '2024-09-28 10:15'
      },
      {
        id: '3',
        senderId: '2',
        senderName: 'Sarah Johnson',
        content: 'Looking forward to discussing the investment terms',
        timestamp: '2024-09-28 14:30'
      }
    ]
  },
  {
    id: '2',
    participantId: '3',
    participantName: 'Michael Chen',
    lastMessage: 'Can we schedule a call next week?',
    timestamp: '2024-09-27 16:45',
    messages: [
      {
        id: '1',
        senderId: '3',
        senderName: 'Michael Chen',
        content: 'Hello! Your HealthConnect idea has great potential.',
        timestamp: '2024-09-27 15:30'
      },
      {
        id: '2',
        senderId: '3',
        senderName: 'Michael Chen',
        content: 'Can we schedule a call next week?',
        timestamp: '2024-09-27 16:45'
      }
    ]
  }
];
