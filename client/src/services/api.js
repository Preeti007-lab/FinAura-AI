const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:5000';
  }
  return '';
};

const getHeaders = (token = '', userId = '') => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['x-user-id'] = userId;
  return headers;
};

export const apiService = {
  // 1. Generate Flashcards via Groq AI & Store in DB (/generate)
  async generateFlashcards(topic, count, token, userId) {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/generate`, {
        method: 'POST',
        headers: getHeaders(token, userId),
        body: JSON.stringify({ topic, count })
      });
      return await res.json();
    } catch (err) {
      console.error('API Error (generateFlashcards):', err);
      return { success: false, message: err.message };
    }
  },

  // 2. Retrieve All Stored Flashcards for User (/getcards)
  async getCards(token, userId) {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/getcards`, {
        headers: getHeaders(token, userId)
      });
      return await res.json();
    } catch (err) {
      console.error('API Error (getCards):', err);
      return { success: false, cards: [] };
    }
  },

  // 3. Delete a Flashcard by ID (/deletecard)
  async deleteCard(cardId, token, userId) {
    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/deletecard`, {
        method: 'POST',
        headers: getHeaders(token, userId),
        body: JSON.stringify({ cardId })
      });
      return await res.json();
    } catch (err) {
      console.error('API Error (deleteCard):', err);
      return { success: false, message: err.message };
    }
  },

  // Portfolio & Risk Profile compatibility methods
  async getPortfolio(token, userId) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/portfolio`, { headers: getHeaders(token, userId) });
      return await res.json();
    } catch (err) { return { success: false }; }
  },
  async getRiskProfile(token, userId) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/risk-profile`, { headers: getHeaders(token, userId) });
      return await res.json();
    } catch (err) { return { success: false }; }
  },
  async updateRiskProfile(answers, token, userId) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/risk-profile`, {
        method: 'POST',
        headers: getHeaders(token, userId),
        body: JSON.stringify({ answers })
      });
      return await res.json();
    } catch (err) { return { success: false }; }
  }
};
