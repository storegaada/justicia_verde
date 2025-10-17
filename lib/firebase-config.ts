import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"
import { getStorage, type Storage } from "firebase/storage"

// Configuración de Firebase - El usuario debe proporcionar estas credenciales
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Inicializar Firebase solo si hay configuración
let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined
let storage: Storage | undefined

if (firebaseConfig.apiKey) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
}

export { app, db, auth, storage }

// Helper para verificar si Firebase está configurado
export const isFirebaseConfigured = () => {
  return !!firebaseConfig.apiKey && !!db
}
