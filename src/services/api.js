const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const userAPI = {
  getAll: () => fetchAPI('/users'),
  
  getById: (id) => fetchAPI(`/users/${id}`),
  
  create: (userData) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  update: (id, userData) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  delete: (id) => fetchAPI(`/users/${id}`, {
    method: 'DELETE',
  }),
};

export const roomAPI = {
  getAll: () => fetchAPI('/rooms'),
  
  getById: (id) => fetchAPI(`/rooms/${id}`),
  
  create: (roomData) => fetchAPI('/rooms', {
    method: 'POST',
    body: JSON.stringify(roomData),
  }),
  
  update: (id, roomData) => fetchAPI(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData),
  }),
  
  delete: (id) => fetchAPI(`/rooms/${id}`, {
    method: 'DELETE',
  }),
};

export const messageAPI = {
  getAll: (roomId = null) => {
    const endpoint = roomId ? `/messages?room_id=${roomId}` : '/messages';
    return fetchAPI(endpoint);
  },
  
  getById: (id) => fetchAPI(`/messages/${id}`),
  
  create: (messageData) => {
    console.log('Creating message:', messageData);
    return fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  update: (id, messageData) => fetchAPI(`/messages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(messageData),
  }),
  
  delete: (id) => fetchAPI(`/messages/${id}`, {
    method: 'DELETE',
  }),
};