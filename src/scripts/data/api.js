import CONFIG from '../config';
import { saveStory, getAllStories } from '../utils/db';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

export async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Login gagal');
  }

  return await response.json();
}

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Registrasi gagal');
  }

  return await response.json(); 
}

export async function getStories(token) {
  try {
    const response = await fetch(ENDPOINTS.GET_STORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Gagal mengambil data dari server');

    const result = await response.json();

    console.log('Result dari API:', result);

    if (result.listStory && Array.isArray(result.listStory) && result.listStory.length > 0) {
      for (const story of result.listStory) {
        console.log('Menyimpan story:', story);
        console.log('Saving story to IndexedDB:', story.id, story);
        await saveStory(story);
      }
    }

    return result.listStory;
  } catch (error) {
    console.warn('Fetch API gagal, ambil data dari IndexedDB:', error.message);

    try {
      const cachedStories = await getAllStories();
      console.log('Data dari IndexedDB:', cachedStories);
      return cachedStories;
    } catch (dbError) {
      console.error('Error mengambil data dari IndexedDB:', dbError);
      return [];
    }
  }
}


export async function addStory(formData, token) {
  const response = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Gagal menambahkan cerita');
  }

  return await response.json();
}
