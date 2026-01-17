alert("script.js loaded");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Book arcs
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

  // Load community data on pages that have the community section
  if (document.getElementById("community")) {
    loadCommunity();
  }

  // If not logged in and trying to access the app page, redirect to index.html
  if (!user) {
    if (window.location.pathname.includes("app")) {
      window.location.href = "index.html";
    }
    return;
  }

  // If logged in but on login or signup page, redirect to app page
  if (
    window.location.pathname.includes("login") ||
    window.location.pathname.includes("signup")
  ) {
    window.location.href = "app.html";
    return;
  }

  // User is logged in, show books and community
  loadUserHeader(user.uid);
  showBooks(user.uid);
  loadCommunity();
});

// SHOW BOOKS
function showBooks(uid) {
  const booksDiv = document.getElementById("books");
  booksDiv.innerHTML = "";

  db.collection("progress").doc(uid).get().then(doc => {
    const progress = doc.exists ? doc.data() : {};

    Object.keys(arcs).forEach(arc => {
      const h = document.createElement("h3");
      h.textContent = arc;
      booksDiv.appendChild(h);

      arcs[arc].forEach(book => {
        const d = document.createElement("div");
        const c = document.createElement("input");
        c.type = "checkbox";
        c.checked = progress[book] === true;
        c.onchange = () => {
          db.collection("progress").doc(uid)
            .set({ [book]: c.checked }, { merge: true });
        };
        d.appendChild(c);
        d.append(" " + book);
        booksDiv.appendChild(d);
      });
    });
  });
}

// LOAD COMMUNITY
function loadCommunity() {
  const communityDiv = document.getElementById("community");
  communityDiv.innerHTML = "";

  db.collection("users").get().then(snap => {
    snap.forEach(u => {
      db.collection("progress").doc(u.id).get().then(p => {
        const count = p.exists
          ? Object.values(p.data()).filter(v => v).length
          : 0;
        const d = document.createElement("div");
        d.textContent = `${u.data().username} (${u.data().clan}) — ${count} books read`;
        communityDiv.appendChild(d);
      });
    });
  });
}

// LOAD USER HEADER
function loadUserHeader(uid) {
  const welcomeDiv = document.getElementById("welcome");

  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();
    welcomeDiv.textContent = `🐾 ${data.username} of ${data.clan}`;
  });
}
