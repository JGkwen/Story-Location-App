import { openDB } from 'idb';

const DATABASE_NAME = 'story-location-db';
const DATABASE_VERSION = 2;

const STORIES_STORE = 'stories';
const DRAFTS_STORE = 'drafts';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (!db.objectStoreNames.contains(STORIES_STORE)) {
      db.createObjectStore(STORIES_STORE, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
      db.createObjectStore(DRAFTS_STORE, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const deleteFromStore = async (storeName, id) => {
  const db = await dbPromise;
  console.log(`Menghapus data dari store ${storeName} dengan ID: ${id}`);
  const result = await db.delete(storeName, id);
  console.log('Hasil penghapusan:', result);
  return result;
};

export const saveStory = async (story) => {
  const db = await dbPromise;
  return db.put(STORIES_STORE, story);
};

export const getAllStories = async () => {
  const db = await dbPromise;
  return db.getAll(STORIES_STORE);
};

export const deleteStory = async (id) => {
  return deleteFromStore(STORIES_STORE, id);
};

export const saveDraft = async (draft) => {
  const db = await dbPromise;
  const { id, ...draftData } = draft;
  console.log('Menyimpan draft ke IndexedDB:', draft); 
  return db.add(DRAFTS_STORE, { ...draftData, createdAt: Date.now() });
};

export const getAllDrafts = async () => {
  const db = await dbPromise;
  return db.getAll(DRAFTS_STORE);
};

export const deleteDraft = async (id) => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  console.log(`Menghapus draft dengan ID: ${numericId}`);
  const db = await dbPromise;
  const draft = await db.get(DRAFTS_STORE, numericId);
  if (!draft) {
    console.log('Draft tidak ditemukan di IndexedDB');  
    throw new Error('Draft tidak ditemukan');
  }
  await db.delete(DRAFTS_STORE, numericId);
  console.log('Draft berhasil dihapus');
};

export const getDraftById = async (id) => {
  const db = await dbPromise;
  return db.get(DRAFTS_STORE, id);
};
