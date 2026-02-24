// src/config/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC6dcvLE_KoBo7nC7ws3TmncQ0F97zszkg",
    authDomain: "zenflow-7e5d1.firebaseapp.com",
    projectId: "zenflow-7e5d1",
    storageBucket: "zenflow-7e5d1.firebasestorage.app",
    messagingSenderId: "835553620214",
    appId: "1:835553620214:web:963cba3a5bcfb394e7bcd7",
    measurementId: "G-DL1KS1WSM8"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
