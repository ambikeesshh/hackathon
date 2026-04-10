import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { FIREBASE_ERROR_MESSAGES } from '../../lib/constants';

const mapFirebaseError = (error) => {
  if (!error?.code) return FIREBASE_ERROR_MESSAGES.default;
  return FIREBASE_ERROR_MESSAGES[error.code] || FIREBASE_ERROR_MESSAGES.default;
};

export const registerUser = async (name, email, password, role) => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const payload = {
      uid: cred.user.uid,
      name: name.trim(),
      email: email.trim(),
      role,
      assignedResources: [],
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), payload);
    return payload;
  } catch (error) {
    throw new Error(mapFirebaseError(error));
  }
};

export const loginUser = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await getUserProfile(cred.user.uid);

    if (!profile) {
      throw new Error('User profile not found. Contact admin.');
    }

    return profile;
  } catch (error) {
    throw new Error(mapFirebaseError(error));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(mapFirebaseError(error));
  }
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() };
};
