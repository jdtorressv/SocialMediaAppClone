const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./socialmediacloneapp-firebase-adminsdk-i8lwt-37abe51ebb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialmediacloneapp.firebaseio.com"
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

exports.createScream = functions.https.onRequest((req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res
        .status(200)
        .json({ message: `document with id ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong!" });
      console.error(err);
    });
});
