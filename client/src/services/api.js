// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Generate AI Roadmap by submitting user profile to backend
 */
export async function fetchGeneratedRoadmap(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to generate roadmap from Gemma 4');
    }

    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Fetch server health status
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return { status: 'offline' };
    return await response.json();
  } catch {
    return { status: 'offline' };
  }
}
