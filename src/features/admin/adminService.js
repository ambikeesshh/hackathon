import {
  createUserWithEmailAndPassword,
  deleteUser as deleteAuthUser,
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export const createUser = async (name, email, password, role) => {
  const cred = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  const user = {
    uid: cred.user.uid,
    name: name.trim(),
    email: email.trim(),
    role,
    assignedResources: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', cred.user.uid), user);
  return user;
};

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, 'users', uid), { role });
};

export const assignResourcesToFaculty = async (uid, resourceIds) => {
  await updateDoc(doc(db, 'users', uid), {
    assignedResources: Array.isArray(resourceIds) ? resourceIds : [],
  });
};

export const deleteUser = async (uid) => {
  await deleteDoc(doc(db, 'users', uid));

  if (auth.currentUser?.uid === uid) {
    await deleteAuthUser(auth.currentUser);
  }
};

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
};
