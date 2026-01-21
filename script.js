alert("script.js loaded");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker",
  appId: "1:603975837840:web:00e1291a87bfec9742d015"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services (MUST COME FIRST)
const auth = firebase.auth();
const db = firebase.firestore();

// SIGN UP
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const clan = document.getElementById("clan").value;

  if (!email || !password || !username || !clan) {
    alert("Fill out all fields");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        username,
        clan,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      window.location.href = "app.html";
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
}

// LOG IN
function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "app.html")
    .catch(err => alert(err.message));
}

// LOG OUT
function logOut() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// AUTH STATE
auth.onAuthStateChanged(user => {
  if (!user && location.pathname.includes("app")) {
    window.location.href = "index.html";
    return;
  }

  if (user) {
    loadUserHeader(user.uid);
    showBooks(user.uid);
    loadCommunity();
  }
});
