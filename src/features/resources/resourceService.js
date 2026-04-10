import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { STATUS } from '../../lib/constants';
import { isValidStatus } from '../../utils/validators';

const RESOURCES_COLLECTION = 'rooms';
const LOGS_COLLECTION = 'logs';

export const updateStatus = async (
  resourceId,
  { status, note = '', occupiedUntil = null, currentOccupancy = null },
  uid
) => {
  if (!isValidStatus(status)) {
    throw new Error('Invalid status value');
  }

  const resourceRef = doc(db, RESOURCES_COLLECTION, resourceId);
  const beforeSnap = await getDoc(resourceRef);
  if (!beforeSnap.exists()) throw new Error('Resource not found');

  const before = beforeSnap.data();
  const updatePayload = {
    status,
    note: note.trim(),
    autoResetAt: occupiedUntil
      ? occupiedUntil.toDate
        ? occupiedUntil
        : Timestamp.fromDate(new Date(occupiedUntil))
      : null,
    updatedBy: uid,
    updatedAt: serverTimestamp(),
  };

  if (typeof currentOccupancy === 'number') {
    updatePayload.currentOccupancy = currentOccupancy;
  }

  await updateDoc(resourceRef, updatePayload);

  await addDoc(collection(db, LOGS_COLLECTION), {
    resourceId,
    resourceName: before.name || 'Unknown',
    previousStatus: before.status || STATUS.FREE,
    newStatus: status,
    note: note.trim(),
    changedBy: uid,
    changedByName: before.lastUpdatedByName || 'Unknown',
    timestamp: serverTimestamp(),
  });
};

export const createResource = async (data) => {
  const payload = {
    name: data.name.trim(),
    type: data.type,
    building: data.building?.trim() || '',
    floor: data.floor?.trim() || '',
    capacity: Number(data.capacity) || 0,
    currentOccupancy: Number(data.currentOccupancy) || 0,
    status: data.currentStatus || STATUS.FREE,
    note: data.statusNote?.trim() || '',
    autoResetAt: null,
    assignedFaculty: Array.isArray(data.assignedFaculty)
      ? data.assignedFaculty
      : [],
    features: Array.isArray(data.equipmentTags) ? data.equipmentTags : [],
    updatedBy: data.createdBy || null,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    createdBy: data.createdBy || null,
  };

  return addDoc(collection(db, RESOURCES_COLLECTION), payload);
};

export const updateResource = async (resourceId, data) => {
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, RESOURCES_COLLECTION, resourceId), payload);
};

export const deleteResource = async (resourceId) => {
  await deleteDoc(doc(db, RESOURCES_COLLECTION, resourceId));
};

export const getResource = async (resourceId) => {
  const snap = await getDoc(doc(db, RESOURCES_COLLECTION, resourceId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};
