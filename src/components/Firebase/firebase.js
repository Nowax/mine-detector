import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.firestore = app.firestore();
    const settings = { timestampsInSnapshots: true };
    this.firestore.settings(settings);
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***
  user = (uid) => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  // *** Firestore API ***
  saveGeoPoints = (points) => {
    const ts = Date.now();
    const name = `minefield-${ts}`;
    return this.firestore
      .collection("minefields")
      .doc(name)
      .set({
        date: ts
      })
      .then(() => {
        console.log("Minefield collection successfully created!");
        return Promise.all(
          points.features.map((p) => {
            return this.firestore
              .collection("minefields")
              .doc(name)
              .collection("mines")
              .add({
                location: p
              })
              .then(() => {
                console.log("Document successfully written!");
              });
          })
        );
      });
  };

  getLatestMinefield = () => {
    return this.firestore
      .collection("minefields")
      .orderBy("date", "desc")
      .limit(1)
      .get()
      .then((snap) => {
        return this.firestore
          .collection("minefields")
          .doc(snap.docs[0].id)
          .collection("mines")
          .get();
      })
      .then((querySnapshot) => {
        console.log("Received latest minefiled: ", querySnapshot);
        return querySnapshot;
      })
      .then((querySnapshot) => querySnapshot.docs.map((d) => d.data()));
  };
}

export default Firebase;
