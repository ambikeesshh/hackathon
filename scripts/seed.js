// scripts/seed.js
// Run with: node scripts/seed.js
// Requires: npm install firebase-admin (run once, outside Vite project)
// Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "YOUR_PROJECT_ID", // ← replace
});

const db = admin.firestore();

const rooms = [
  "Computer Lab 101",
  "Computer Lab 102",
  "Physics Lab",
  "Chemistry Lab",
  "Library Room A",
  "Library Room B",
  "Seminar Hall 1",
  "Seminar Hall 2",
  "Classroom 301",
  "Classroom 302",
];

async function seed() {
  const batch = db.batch();
  for (const name of rooms) {
    const ref = db.collection("rooms").doc();
    batch.set(ref, {
      name,
      status: "free",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: null,
      autoResetAt: null,
    });
  }
  await batch.commit();
  console.log(`✅ Seeded ${rooms.length} rooms.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
