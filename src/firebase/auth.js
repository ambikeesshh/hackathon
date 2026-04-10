// src/firebase/auth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export const loginUser = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", cred.user.uid));
  if (!userDoc.exists()) throw new Error("User profile not found.");
  return { uid: cred.user.uid, ...userDoc.data() };
};

export const registerUser = async (email, password, name, role = "student") => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const userData = { id: cred.user.uid, name, email, role, createdAt: serverTimestamp() };
  await setDoc(doc(db, "users", cred.user.uid), userData);
  return { uid: cred.user.uid, ...userData };
};

export const logoutUser = () => signOut(auth);

export const subscribeAuthState = (callback) => onAuthStateChanged(auth, callback);

export const fetchUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
};
