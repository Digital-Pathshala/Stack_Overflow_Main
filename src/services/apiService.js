// Simple API service using fetch for GET requests

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000/api';


export async function get(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// You can add more methods (post, put, delete) as needed

// Fetch all chat rooms
export async function getRooms() {
  return get('/rooms');
}

// Fetch all users
export async function getUsers() {
  return get('/users');
}
