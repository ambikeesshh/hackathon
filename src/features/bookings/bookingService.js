import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const BOOKINGS_COLLECTION = 'bookings';

export const createBooking = async (data) => {
  const payload = {
    resourceId: data.resourceId,
    resourceName: data.resourceName,
    studentId: data.studentId,
    studentName: data.studentName,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    purpose: data.purpose?.trim() || '',
    status: 'pending',
    responseNote: '',
    respondedBy: null,
    respondedAt: null,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, BOOKINGS_COLLECTION), payload);
};

export const updateBookingStatus = async (
  bookingId,
  status,
  responseNote,
  facultyUid
) => {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
    status,
    responseNote: responseNote?.trim() || '',
    respondedBy: facultyUid,
    respondedAt: serverTimestamp(),
  });
};

export const getBookingsForStudent = async (studentUid) => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('studentId', '==', studentUid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getBookingsForResource = async (resourceId) => {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('resourceId', '==', resourceId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
