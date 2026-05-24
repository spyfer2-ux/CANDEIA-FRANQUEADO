import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  signInWithPopup,
  signOut, 
  getRedirectResult,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBHk_pJO_-xvIZ3gsiSNNaq7NfHsW-VPZI",
  authDomain: "candeia-jr.firebaseapp.com",
  projectId: "candeia-jr",
  storageBucket: "candeia-jr.firebasestorage.app",
  messagingSenderId: "825450097768",
  appId: "1:825450097768:web:da2bc771011825b68c1fdd"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export const loginGoogle = async () => {
  await setPersistence(auth, browserLocalPersistence)
  try {
    // Tenta popup primeiro
    return await signInWithPopup(auth, googleProvider)
  } catch (e) {
    // Se popup bloqueado, usa redirect
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user') {
      return signInWithRedirect(auth, googleProvider)
    }
    throw e
  }
}

export const logout = () => signOut(auth)
export { getRedirectResult }
