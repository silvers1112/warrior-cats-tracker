alert("script.js loaded");

// PAGE CHECK
const onLandingPage = window.location.pathname.includes("index");
const onAppPage = window.location.pathname.includes("app");

// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// NAV
function goToSignup() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("auth").style.display = "block";
  document.getElementById("username").style.display = "block";
}

function goToLogin() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("auth").style.display = "block";
  document.getElementById("username").style.display = "none";
}

// BOOKS
const arcs = {
  "The Prophecies Begin": [
    "Into the Wild", "Fire and Ice", "Forest of Secrets",
    "Rising Storm", "A Dangerous Path", "The Darkest Hour"
  ],
  "The New Prophecy": [
    "Midnight", "Moonrise", "Dawn", "Starlight", "Twilight", "Sunset"
  ],
  "Power of Three": [
    "The Sight", "Dark River", "Outcast",
    "Eclipse", "Long Shadows", "Sunrise"
  ]
};

// SIGN UP
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const clan = document.getElementById("clan").value;

  if (!email || !password || !username || !clan) {
    alert("Please fill in all fields.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        username: username,
        clan: clan
      });
    })
    .then(() => {
      window.location.href = "app.html";  // Redirect after successful sign-up
    })
    .catch(err => {
      alert(err.message);  // Show error if something goes wrong
    });
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
    .then(() => {
      window.location.href = "app.html";  // Redirect to app.html after successful login
    })
    .catch(err => {
      alert(err.message);
    });
}

// LOG OUT
function logOut() {
  auth.signOut();
  window.location.href = "index.html";  // Redirect to the landing page after logout
}

// AUTH STATE
auth.onAuthStateChanged(user => {

  if (document.getElementById("community")) {
    loadCommunity();  // Load the community on pages that have the community section
  }

  if (!user) {
    if (window.location.pathname.includes("app")) {
      window.location.href = "index.html";  // Redirect to landing page if not logged in
    }
    return;
  }

  if (
    window.location.pathname.includes("login") ||
    window.location.pathname.includes("signup")
  ) {
    window.location.href = "app.html";  // Redirect to profile page if already logged in
    return;
  }

  loadUserHeader(user.uid);
  showBooks(user.uid);
  loadCommunity();
});

// BOOK DISPLAY
function showBooks(uid) {
  const booksDiv = document.getElementById("books");
  booksDiv.in
