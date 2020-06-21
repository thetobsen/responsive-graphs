const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.deleteCommentToken = functions.region('europe-west1').firestore
  	.document('comments/{id}')
  	.onCreate((snap, context) => {
		admin.firestore().collection('comments').doc(snap.id).update({ t: admin.firestore.FieldValue.delete() });
  	}
);
