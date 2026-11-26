import { getFirebaseDb, getFirebaseStorage, isFirebaseConfigured } from './firebase/config';
import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  // 1. Try Firebase Firestore first (User's connected database)
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (db) {
      try {
        const docRef = doc(db, 'site_content', 'main_data');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          console.log('Seeding initial website content to Firebase Firestore...');
          const initialData = getLocalFallbackData();
          await setDoc(docRef, initialData);
          return initialData;
        }
      } catch (err) {
        console.warn('Firebase read error, checking other sources:', err);
      }
    }
  }

  // 2. Try Supabase (if configured)
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_store')
          .select('data')
          .eq('id', 'content')
          .maybeSingle();

        if (data && data.data) {
          return data.data;
        }

        if (!error) {
          const initialData = getLocalFallbackData();
          await supabase.from('site_store').upsert({ id: 'content', data: initialData });
          return initialData;
        }
      } catch (err) {
        console.warn('Supabase read error:', err);
      }
    }
  }

  // 3. Offline / Local fallback
  return getLocalFallbackData();
}

export async function saveContentData(data: any): Promise<boolean> {
  let saved = false;

  // 1. Save to Firebase Firestore (User's connected database)
  if (isFirebaseConfigured()) {
    const db = getFirebaseDb();
    if (db) {
      try {
        const docRef = doc(db, 'site_content', 'main_data');
        await setDoc(docRef, data);
        saved = true;
      } catch (err) {
        console.error('Error saving to Firebase Firestore:', err);
      }
    }
  }

  // 2. Save to Supabase (if configured)
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('site_store').upsert({
          id: 'content',
          data,
          updated_at: new Date().toISOString(),
        });
        if (!error) saved = true;
      } catch (err) {
        console.error('Error saving to Supabase:', err);
      }
    }
  }

  // 3. Save locally if filesystem is writable (local dev)
  try {
    if (fs.existsSync(path.dirname(DATA_FILE))) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (err) {
    // Read-only serverless environment
  }

  return saved;
}

export async function uploadFileToCloud(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string | null> {
  const sanitized = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // 1. Try Firebase Storage
  if (isFirebaseConfigured()) {
    const storage = getFirebaseStorage();
    if (storage) {
      try {
        const storageRef = ref(storage, `uploads/${sanitized}`);
        await uploadBytes(storageRef, buffer, { contentType });
        return await getDownloadURL(storageRef);
      } catch (err) {
        console.error('Error uploading to Firebase Storage:', err);
      }
    }
  }

  // 2. Try Supabase Storage (if configured)
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(sanitized, buffer, {
            contentType,
            upsert: true,
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('uploads').getPublicUrl(sanitized);
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.error('Error uploading to Supabase Storage:', err);
      }
    }
  }

  return null;
}
