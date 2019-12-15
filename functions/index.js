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

const db = admin.firestore();

app.get("/screams", (req, res) => {
  db.collection("screams")
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
  db.collection("screams")
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

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx);
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let errors = {};
  if (isEmpty(newUser.email)) errors.email = "Must not be empty";
  else if (!isEmail(newUser.email)) errors.email = "Must be a valid email";
  if (isEmpty(newUser.password)) errors.password = "Must not be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Must match password";
  if (isEmpty(newUser.handle)) errors.handle = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(403).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return res.status(400).json({ email: "email is already in use" });
      else return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
