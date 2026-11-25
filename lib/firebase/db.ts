import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './config';
import fs from 'fs';
import path from 'path';
import {
  sampleProfile,
  sampleQuotes,
  samplePoems,
  sampleArticles,
  sampleResearch,
  samplePosters,
  sampleBooks,
  sampleFeaturedItem,
} from '@/lib/starter-data';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

export function getLocalFallbackData(): any {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading local data/content.json:', err);
  }
  return {
    profile: sampleProfile,
    quotes: sampleQuotes,
    poems: samplePoems,
    articles: sampleArticles,
    research: sampleResearch,
    posters: samplePosters,
    books: sampleBooks,
    featured: sampleFeaturedItem,
  };
}

export async function getContentData(): Promise<any> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'site_content', 'main_data');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Document does not exist yet in Firestore: seed it from existing content.json!
        console.log('Seeding initial website content to Firebase Firestore...');
        const initialData = getLocalFallbackData();
        await setDoc(docRef, initialData);
        return initialData;
      }
    } catch (err) {
      console.error('Firestore read error, falling back to local file:', err);
      return getLocalFallbackData();
    }
  }

  return getLocalFallbackData();
}

export async function saveContentData(data: any): Promise<boolean> {
  let savedToFirebase = false;

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'site_content', 'main_data');
      await setDoc(docRef, data);
      savedToFirebase = true;
    } catch (err) {
      console.error('Error saving to Firebase Firestore:', err);
    }
  }

  // Also try saving locally if filesystem is writable (e.g. local development)
  try {
    if (fs.existsSync(path.dirname(DATA_FILE))) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (err) {
    // Filesystem may be read-only on Netlify / Vercel serverless functions, which is normal
  }

  return savedToFirebase;
}

export async function uploadFileToCloud(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string | null> {
  if (isFirebaseConfigured() && storage) {
    try {
      const sanitized = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `uploads/${sanitized}`);
      await uploadBytes(storageRef, buffer, { contentType });
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (err) {
      console.error('Error uploading file to Firebase Storage:', err);
      return null;
    }
  }
  return null;
}
