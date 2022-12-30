const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

exports.getUserData = functions.https.onRequest(
    async (request, response) => {
      const userData = await admin
        .firestore()
        .collection('users')
        .doc(request.query.userID)
        .get();
  
      return response.status(200).send(userData.data());
    }
  );