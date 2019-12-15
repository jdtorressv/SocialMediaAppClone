const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

var serviceAccount = require("./socialmediacloneapp-firebase-adminsdk-i8lwt-37abe51ebb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialmediacloneapp.firebaseio.com"
});

const firebaseConfig = {
  apiKey: "AIzaSyAKRyWXQsOh2hqMxAHB5fTUCjKLHIn9HhM",
  authDomain: "socialmediacloneapp.firebaseapp.com",
  databaseURL: "https://socialmediacloneapp.firebaseio.com",
  projectId: "socialmediacloneapp",
  storageBucket: "socialmediacloneapp.appspot.com",
  messagingSenderId: "562773185893",
  appId: "1:562773185893:web:f8401b282f34c735543d8c",
  measurementId: "G-FKF9ZLL817"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
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

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
    handle: req.body.handle
  };

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({
          message: `user with id ${data.user.uid} signed up successfully`
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
