import { openDB } from 'idb';

const DATABASE_NAME = 'story-location-db';
const DATABASE_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const saveStory = async (story) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, story);
};

export const getAllStories = async () => {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
};

export const deleteStory = async (id) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};
