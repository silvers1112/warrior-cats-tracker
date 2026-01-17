alert("script.js loaded");

// PAGE DETECTION
const onLandingPage = window.location.pathname.includes("index");
const onAuthPage = window.location.pathname.includes("auth");
const onAppPage = window.location.pathname.includes("app");

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// NAVIGATION
function goToSignup() {
  window.location.href = "auth.html";
}

function goToLogin() {
  window.location.href = "auth.html";
}

// BOOK ARCS
const arcs = {
  "The Prophecies Begin": [
    "Into the Wild",
    "Fire and Ice",
    "Forest of Secrets",
    "Rising Storm",
    "A Dangerous Path",
    "The Darkest Hour"
  ],
  "The New Prophecy": [
    "Midnight",
    "Moonrise",
    "Dawn",
    "Starlight",
    "Twilight",
    "Sunset"
  ],
  "Power of Three": [
    "The Sight",
    "Dark River",
    "Outcast",
    "Eclipse",
    "Long Shadows",
    "Sunrise"
  ]
};

// SIGN UP
function signUp() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const clan = document.getElementById("clan").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        username: username,
        clan: clan
      });
    })
    .catch(err => alert(err.message));
}

// LOG IN
function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

// LOG OUT
function logOut() {
  auth.signOut();
}

// AUTH STATE CONTROL (MOST IMPORTANT PART)
auth.onAuthStateChanged(user => {

  // LOAD COMMUNITY ON ANY PAGE THAT HAS IT
  if (document.getElementById("community")) {
    loadCommunity();
  }

  // NOT LOGGED IN
  if (!user) {
    if (onAppPage) {
      window.location.href = "index.html";
    }
    return;
  }

  // LOGGED IN BUT NOT ON
