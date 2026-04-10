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
import { normalizeRoom } from "../utils/helpers";
import { logRoomAction } from "./activityLogs";

// Single global listener - call once in app root
export const subscribeRooms = (callback) => {
  const q = query(collection(db, "rooms"), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const rooms = snap.docs.map((d) => normalizeRoom({ id: d.id, ...d.data() }));
    callback(rooms);
  });
};

export const toggleRoomStatus = async (room, userId) => {
  const ref = doc(db, "rooms", room.id);
  if (room.status === "free" || room.status === "reserved") {
    const autoResetAt = Timestamp.fromDate(
      new Date(Date.now() + 2 * 60 * 60 * 1000)
    );
    await updateDoc(ref, {
      status: "occupied",
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      autoResetAt,
      reservedBy: null,
      reservedUntil: null,
    });
    await logRoomAction(room.id, "occupied", userId, room.note || "");
  } else {
    await updateDoc(ref, {
      status: "free",
      updatedAt: serverTimestamp(),
      updatedBy: userId,
      autoResetAt: null,
    });
    await logRoomAction(room.id, "free", userId, room.note || "");
  }
};

export const reserveRoom = async ({ roomId, userId, minutes = 30, note = "" }) => {
  const reservedUntil = Timestamp.fromDate(new Date(Date.now() + minutes * 60 * 1000));
  const ref = doc(db, "rooms", roomId);
  await updateDoc(ref, {
    reservedBy: userId,
    reservedUntil,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
    note,
  });
  await logRoomAction(roomId, "reserved", userId, note);
};

export const clearReservation = async ({ roomId, userId }) => {
  const ref = doc(db, "rooms", roomId);
  await updateDoc(ref, {
    reservedBy: null,
    reservedUntil: null,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
};

export const addRoom = async (name, extraFields = {}) => {
  await addDoc(collection(db, "rooms"), {
    name,
    building: "",
    floor: "",
    type: "classroom",
    capacity: 0,
    status: "free",
    updatedAt: serverTimestamp(),
    updatedBy: null,
    note: "",
    autoResetAt: null,
    reservedBy: null,
    reservedUntil: null,
    features: [],
    coordinates: { x: null, y: null },
    createdAt: serverTimestamp(),
    ...extraFields,
  });
};

export const deleteRoom = async (roomId) => {
  await deleteDoc(doc(db, "rooms", roomId));
};

export const addLog = async (roomId, userId, action, note = "") => {
  try {
    await logRoomAction(roomId, action, userId, note);
  } catch {
    // logs are optional, silently fail
  }
};
