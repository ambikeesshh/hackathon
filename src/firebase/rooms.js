// src/firebase/rooms.js
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";

// Single global listener - call once in app root
export const subscribeRooms = (callback) => {
  const q = query(collection(db, "rooms"), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(rooms);
  });
};

export const toggleRoomStatus = async (room, userId) => {
  const ref = doc(db, "rooms", room.id);
  if (room.status === "free") {
    const autoResetAt = Timestamp.fromDate(
      new Date(Date.now() + 2 * 60 * 60 * 1000)
    );
    await updateDoc(ref, {
      status: "occupied",
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      autoResetAt,
    });
  } else {
    await updateDoc(ref, {
      status: "free",
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      autoResetAt: null,
    });
  }
};

export const addRoom = async (name) => {
  await addDoc(collection(db, "rooms"), {
    name,
    status: "free",
    updatedAt: serverTimestamp(),
    updatedBy: null,
    autoResetAt: null,
  });
};

export const deleteRoom = async (roomId) => {
  await deleteDoc(doc(db, "rooms", roomId));
};

// For analytics: fetch logs if available
export const addLog = async (roomId, userId, action) => {
  try {
    await addDoc(collection(db, "logs"), {
      roomId,
      userId,
      action, // "occupied" | "free"
      timestamp: serverTimestamp(),
    });
  } catch (_) {
    // logs are optional, silently fail
  }
};
