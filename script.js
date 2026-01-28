console.log("script.js loaded");

// =====================
// FIREBASE CONFIG
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker",
  appId: "1:603975837840:web:00e1291a87bfec9742d015",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// =====================
// HELPERS
// =====================
function path() {
  return (window.location.pathname || "").toLowerCase();
}

function onPage(filename) {
  return path().endsWith("/" + filename.toLowerCase()) || path().includes(filename.toLowerCase());
}

function go(page) {
  window.location.href = page;
}

// =====================
// AUTH ACTIONS (LOGIN / SIGNUP / LOGOUT)
// =====================
function logIn() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => go("profile.html"))
    .catch((err) => {
      console.error(err);
      alert(err.message);
    });
}

function signUp() {
  const username = document.getElementById("username")?.value?.trim();
  const clan = document.getElementById("clan")?.value;
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  if (!username || !clan || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        username,
        clan,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    .then(() => go("profile.html"))
    .catch((err) => {
      console.error(err);
      alert(err.message);
    });
}

function logOut() {
  auth.signOut().then(() => go("index.html"));
}

// =====================
// PROFILE: LOAD NAME/CLAN + BIO
// =====================
function loadProfile(uid) {
  const welcomeEl = document.getElementById("welcome");
  if (!welcomeEl) return;

  db.collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      if (!doc.exists) return;
      const data = doc.data();

      welcomeEl.innerHTML = `
        <div class="profile-name">${data.username || ""}</div>
        <div class="profile-clan">${data.clan || ""}</div>
      `;
    });
}

function loadBio(uid) {
  const bioInput = document.getElementById("bioInput");
  if (!bioInput) return;

  db.collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      if (!doc.exists) return;
      bioInput.value = doc.data().bio || "";
    });
}

function publishBio() {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to publish your bio.");
    return;
  }

  const bioInput = document.getElementById("bioInput");
  const status = document.getElementById("bioStatus");
  if (!bioInput) return;

  const bio = bioInput.value.trim();
  if (status) status.textContent = "Saving...";

  db.collection("users")
    .doc(user.uid)
    .set(
      {
        bio,
        bioUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )
    .then(() => {
      if (status) status.textContent = "✅ Bio saved";
    })
    .catch((err) => {
      console.error(err);
      if (status) status.textContent = "❌ Error saving bio";
      alert(err.message);
    });
}

// =====================
// AUTH ROUTING
// =====================
auth.onAuthStateChanged((user) => {
  const isLogin = onPage("login.html");
  const isSignup = onPage("signup.html");
  const isProfile = onPage("profile.html");
  const isApp = onPage("app.html");
  const isCommunity = onPage("community.html");

  // Protect these pages
  if (!user && (isProfile || isApp || isCommunity)) {
    go("index.html");
    return;
  }

  // If logged in, don't stay on login/signup
  if (user && (isLogin || isSignup)) {
    go("profile.html");
    return;
  }

  // Load profile data when on profile page
  if (user && isProfile) {
    loadProfile(user.uid);
    loadBio(user.uid);
  }

  // (Optional) If you later add app/community JS, you'd call it here safely:
  // if (user && isApp) { ... }
  // if (user && isCommunity) { ... }
});
