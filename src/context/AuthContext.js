import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = "smitAdmin@l.com";

  const signup = async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        isAdmin: email === ADMIN_EMAIL,
        ...userData
      });
      
      return user;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userId, data) => {
    try {
      await setDoc(doc(db, 'users', userId), data, { merge: true });
      setUserData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setIsAdmin(userData.isAdmin || user.email === ADMIN_EMAIL);
          } else {
            setUserData({ email: user.email });
            setIsAdmin(user.email === ADMIN_EMAIL);
          }
        } catch (error) {
          console.error('Ошибка загрузки данных пользователя:', error);
          setUserData({ email: user.email });
          setIsAdmin(user.email === ADMIN_EMAIL);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

const value = {
  currentUser,
  userData,
  isAdmin,
  signup,
  login,
  logout,
  updateUserProfile
};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};