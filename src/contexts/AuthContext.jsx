import { createContext, useContext, useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Cadastro com email e senha
    async function register(email, password, displayName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Atualiza o perfil no Firebase Auth
        await updateProfile(user, { displayName })

        // Cria documento do usuário no Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName,
            email,
            photoURL: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })

        return userCredential
    }

    // Login com email e senha
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // Login com Google
    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider()
        const userCredential = await signInWithPopup(auth, provider)
        const user = userCredential.user

        // Verifica se o usuário já existe no Firestore, se não cria
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        }

        return userCredential
    }

    // Logout
    function logout() {
        setUserProfile(null)
        return signOut(auth)
    }

    // Reset de senha
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    // Carrega perfil do Firestore
    async function loadUserProfile(uid) {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid))
            if (userDoc.exists()) {
                setUserProfile(userDoc.data())
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error)
        }
    }

    // Observa mudanças de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
            if (user) {
                await loadUserProfile(user.uid)
            } else {
                setUserProfile(null)
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userProfile,
        loading,
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        loadUserProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }
