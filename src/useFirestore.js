import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

// Hook לניהול collection ב-Firestore עם real-time updates
export const useFirestoreCollection = (collectionName, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // קריאת נתונים ב-real-time
  useEffect(() => {
    setLoading(true);
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error loading ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  // הוספת פריט חדש
  const addItem = async (item) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...item };
    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      throw err;
    }
  };

  // עדכון פריט
  const updateItem = async (id, updates) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(`Error updating item in ${collectionName}:`, err);
      throw err;
    }
  };

  // מחיקת פריט
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error(`Error deleting item from ${collectionName}:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
};

// Hook ספציפי לרכבים
export const useVehicles = () => {
  return useFirestoreCollection('vehicles', []);
};

// Hook ספציפי להזמנות
export const useBookings = () => {
  return useFirestoreCollection('bookings', []);
};

// Hook ספציפי למשתמשים
export const useUsers = () => {
  return useFirestoreCollection('users', []);
};
