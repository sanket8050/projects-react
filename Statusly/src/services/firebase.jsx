import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore'

// Firebase config (replace with your credentials in .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Firestore Security Rules (implement in Firebase Console):
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /shops/{shopId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/

// Auth functions
export const signUp = async (email, password, name, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    name,
    email,
    role,
    favorites: []
  })
  return user
}

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const signOutUser = async () => {
  await signOut(auth)
}

// Shop functions
export const createShop = async (shopData) => {
  const shopRef = doc(collection(db, 'shops'))
  await setDoc(shopRef, { ...shopData, id: shopRef.id })
  return shopRef.id
}

export const updateShop = async (shopId, data) => {
  const shopRef = doc(db, 'shops', shopId)
  await updateDoc(shopRef, { ...data, lastUpdated: new Date() })
}

export const getShop = (shopId, callback) => {
  const shopRef = doc(db, 'shops', shopId)
  return onSnapshot(shopRef, (doc) => {
    if (doc.exists()) callback({ id: doc.id, ...doc.data() })
  })
}

export const getNearbyShops = (lat, lng, radius = 5000, queryText = '', type = '', callback) => {
  // For MVP, fetch all shops and filter by distance client-side
  const shopsRef = collection(db, 'shops')
  let q = shopsRef
  if (type) q = query(shopsRef, where('type', '==', type))
  return onSnapshot(q, (snapshot) => {
    const shops = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(shop => {
        const distance = calculateDistance(lat, lng, shop.location.lat, shop.location.lng)
        return distance <= radius / 1000 // Convert meters to km
      })
      .filter(shop => {
        if (!queryText) return true
        const searchText = queryText.toLowerCase()
        return shop.name.toLowerCase().includes(searchText) ||
          shop.todayMenu.some(item => item.name.toLowerCase().includes(searchText))
      })
    callback(shops)
  })
}

export const addFavorite = async (userId, shopId) => {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  if (userDoc.exists()) {
    const favorites = userDoc.data().favorites || []
    if (!favorites.includes(shopId)) {
      await updateDoc(userRef, { favorites: [...favorites, shopId] })
    }
  }
}

export const removeFavorite = async (userId, shopId) => {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  if (userDoc.exists()) {
    const favorites = userDoc.data().favorites || []
    await updateDoc(userRef, { favorites: favorites.filter(id => id !== shopId) })
  }
}