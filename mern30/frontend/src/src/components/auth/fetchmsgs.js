import axios from 'axios';

const fetchMessages = async (token) => {
  try {
    const response = await axios.get('http://localhost:3001/messages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const messages = response.data;
    console.log('Fetched messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export default fetchMessages;
