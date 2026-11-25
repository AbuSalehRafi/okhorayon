import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { db, storage, isFirebaseConfigured } from './firebase/config';
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
  // 1. Try Supabase first (Recommended 100% Free Database)
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

        // Auto-seed initial content to Supabase if empty
        if (!error) {
          const initialData = getLocalFallbackData();
          await supabase.from('site_store').upsert({ id: 'content', data: initialData });
          return initialData;
        }
      } catch (err) {
        console.warn('Supabase read error, checking fallbacks:', err);
      }
    }
  }

  // 2. Try Firebase (Secondary Cloud Option)
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'site_content', 'main_data');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        const initialData = getLocalFallbackData();
        await setDoc(docRef, initialData);
        return initialData;
      }
    } catch (err) {
      console.warn('Firebase read error, using local fallback:', err);
    }
  }

  // 3. Offline / Local fallback
  return getLocalFallbackData();
}

export async function saveContentData(data: any): Promise<boolean> {
  let saved = false;

  // 1. Save to Supabase (if configured)
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

  // 2. Save to Firebase (if configured)
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'site_content', 'main_data');
      await setDoc(docRef, data);
      saved = true;
    } catch (err) {
      console.error('Error saving to Firebase:', err);
    }
  }

  // 3. Save locally if filesystem is writable
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

  // 1. Try Supabase Storage (100% Free 1GB bucket)
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
        } else {
          console.warn('Supabase storage upload notice:', uploadError.message);
        }
      } catch (err) {
        console.error('Error uploading to Supabase Storage:', err);
      }
    }
  }

  // 2. Try Firebase Storage (if configured)
  if (isFirebaseConfigured() && storage) {
    try {
      const storageRef = ref(storage, `uploads/${sanitized}`);
      await uploadBytes(storageRef, buffer, { contentType });
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error('Error uploading to Firebase Storage:', err);
    }
  }

  return null;
}
