import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: "AIzaSyAw9qwVPn_0O5WLg0yg4NpzIOSZe2lx5Gk",
  authDomain: "okhorayon.firebaseapp.com",
  projectId: "okhorayon",
  storageBucket: "okhorayon.firebasestorage.app",
  messagingSenderId: "1019059487398",
  appId: "1:1019059487398:web:6b06efa713664510192a67",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

async function seed() {
  console.log('Connecting to Firebase Firestore for project: okhorayon...');
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const contentData = JSON.parse(raw);

    const docRef = doc(db, 'site_content', 'main_data');
    console.log('Writing website content to Firestore document: site_content/main_data...');
    await setDoc(docRef, contentData);
    console.log('SUCCESS: Content written to Firestore successfully!');

    console.log('Verifying read from Firestore...');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      console.log(`VERIFIED: Firestore has ${data.articles?.length || 0} articles, ${data.poems?.length || 0} poems, ${data.books?.length || 0} books.`);
    } else {
      console.error('ERROR: Document does not exist after write.');
    }
    process.exit(0);
  } catch (err) {
    console.error('FIREBASE FIRESTORE ERROR:', err);
    process.exit(1);
  }
}

seed();
