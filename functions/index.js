const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.cleanupDuplicateEmails = onDocumentWritten(
  "prelaunch_signups/{docId}",
  async (event) => {
    const newData = event.data?.after?.data();
    if (!newData || !newData.email) {
      console.log("No valid data");
      return;
    }

    const email = newData.email;

    // Query all documents with the same email, newest first
    const snapshot = await db
      .collection("prelaunch_signups")
      .where("email", "==", email)
      .orderBy("timestamp", "desc")
      .get();

    const docs = snapshot.docs;
    if (docs.length <= 1) {
      console.log("No duplicates to delete");
      return;
    }

    // Keep only the newest, delete the rest
    const [, ...duplicates] = docs; // Skip index 0
    const deletePromises = duplicates.map((doc) => {
      console.log("Deleting duplicate:", doc.id);
      return doc.ref.delete();
    });

    await Promise.all(deletePromises);
    console.log(`Removed ${duplicates.length} duplicates for ${email}`);
  }
);
