const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.incrementCommentCounter = functions.region('europe-west1').firestore
  	.document('comments/{id}')
  	.onCreate((snap, context) => {
		const { postedTo } = snap.data();

		console.log(postedTo);
  	}
);
