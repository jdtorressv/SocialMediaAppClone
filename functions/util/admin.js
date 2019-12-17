const admin = require("firebase-admin");
var serviceAccount = require("../socialmediacloneapp-firebase-adminsdk-i8lwt-37abe51ebb.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "socialmediacloneapp.appspot.com",
  databaseURL: "https://socialmediacloneapp.firebaseio.com"
});
const db = admin.firestore();
module.exports = {
  admin,
  db
};
