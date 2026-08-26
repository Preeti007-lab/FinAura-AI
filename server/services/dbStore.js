// Memory fallback store for smooth operation when MongoDB is not connected
let isMongoConnected = false;

const memoryDb = {
  users: {
    'demo_investor_99': {
      id: 'demo_investor_99',
      email: 'alex.investor@finaura.app',
      name: 'Alex Vance'
    }
  },
  flashcards: [
    {
      _id: 'card_1',
      userId: 'demo_investor_99',
      topic: 'Quantum Computing',
      question: 'What is Quantum Superposition?',
      answer: 'Superposition allows a quantum bit (qubit) to exist in a state representing both 0 and 1 simultaneously until measured, allowing quantum computers to process complex parallel computations.',
      difficulty: 'Hard',
      createdAt: '2026-08-20T10:00:00.000Z'
    },
    {
      _id: 'card_2',
      userId: 'demo_investor_99',
      topic: 'Quantum Computing',
      question: 'What is Quantum Entanglement?',
      answer: 'Entanglement is a phenomenon where quantum particles become inextricably linked, such that the quantum state of one particle instantly influences another, regardless of distance.',
      difficulty: 'Hard',
      createdAt: '2026-08-20T10:05:00.000Z'
    },
    {
      _id: 'card_3',
      userId: 'demo_investor_99',
      topic: 'Machine Learning',
      question: 'Difference between Supervised and Unsupervised Learning?',
      answer: 'Supervised learning trains models on labeled input-output pairs to predict outcomes. Unsupervised learning analyzes unlabeled data to find hidden patterns, clusters, and structures.',
      difficulty: 'Medium',
      createdAt: '2026-08-21T09:00:00.000Z'
    },
    {
      _id: 'card_4',
      userId: 'demo_investor_99',
      topic: 'Personal Finance',
      question: 'What is the Rule of 72 in Compound Interest?',
      answer: 'The Rule of 72 is a quick mental shortcut to estimate how many years it takes for an investment to double. Divide 72 by the annual return rate (e.g. 72 / 12% = 6 years).',
      difficulty: 'Easy',
      createdAt: '2026-08-21T11:00:00.000Z'
    }
  ],
  portfolios: [],
  transactions: [],
  goals: [],
  analyses: []
};

const setMongoConnected = (connected) => {
  isMongoConnected = connected;
};

const getMongoConnected = () => isMongoConnected;

module.exports = { memoryDb, getMongoConnected, setMongoConnected };
