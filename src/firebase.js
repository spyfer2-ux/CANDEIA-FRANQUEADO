import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth'
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

export const loginGoogle = () => signInWithRedirect(auth, googleProvider)
export const logout = () => signOut(auth)
export { getRedirectResult }
