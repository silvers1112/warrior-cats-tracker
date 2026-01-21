alert("script.js loaded");
alert("script.js loaded");

// =====================
// FIREBASE CONFIG
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker",
  appId: "1:603975837840:web:00e1291a87bfec9742d015"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

// =====================
// WARRIOR CAT ARCS
// =====================
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
  ],
  "Omen of the Stars": [
    "The Fourth Apprentice",
    "Fading Echoes",
    "Night Whispers",
    "Sign of the Moon",
    "The Forgotten Warrior",
    "The Last Hope"
  ]
};

// =====================
// LOAD USER HEADER FUNCTION (Fixed position)
// =====================
function loadUserHeader(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();
    document.getElementById("welcome").textContent =
      `🐾 ${data.username} of ${data.clan}`;
  });
}

// =====================
// SIGN UP
// =====================
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const clan = document.getElementById("clan").value;

  if (!email || !password || !username || !clan) {
    alert("Please fill out all fields");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        username: username,
        clan: clan,
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

// =====================
// LOG IN
// =====================
function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "app.html")
    .catch(err => alert(err.message));
}

// =====================
// LOG OUT
// =====================
function logOut() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// =====================
// AUTH STATE
// =====================
auth.onAuthStateChanged(user => {

  // Redirect if not logged in
  if (!user && location.pathname.includes("app")) {
    window.location.href = "index.html";
    return;
  }

  if (user) {
    if (document.getElementById("welcome")) {
      loadUserHeader(user.uid);
    }

    if (document.getElementById("books")) {
      showBooks(user.uid);
    }

    if (document.getElementById("community")) {
      loadCommunity();
    }
  }
});

// =====================
// SHOW BOOKS
// =====================
function showBooks(uid) {
  const booksDiv = document.getElementById("books");
  booksDiv.innerHTML = "";

  db.collection("progress").doc(uid).get().then(doc => {
    const progress = doc.exists ? doc.data() : {};

    Object.keys(arcs).forEach(arc => {
      const arcDiv = document.createElement("div");
      arcDiv.className = "arc";

      const title = document.createElement("h3");
      title.textContent = arc;
      arcDiv.appendChild(title);

      arcs[arc].forEach(book => {
        const bookDiv = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = progress[book] === true;

        checkbox.onchange = () => {
          db.collection("progress").doc(uid)
            .set({ [book]: checkbox.checked }, { merge: true });
        };

        const label = document.createElement("span");
        label.textContent = book;

        bookDiv.appendChild(checkbox);
        bookDiv.appendChild(label);
        arcDiv.appendChild(bookDiv);
      });

      booksDiv.appendChild(arcDiv);
    });
  });
}

// =====================
// LOAD COMMUNITY
// =====================
function loadCommunity() {
  const communityDiv = document.getElementById("community");
  communityDiv.innerHTML = "";

  db.collection("users").get().then(snapshot => {
    snapshot.forEach(userDoc => {
      const userId = userDoc.id;
      const userData = userDoc.data();

      db.collection("progress").doc(userId).get().then(progressDoc => {
        const progress = progressDoc.exists ? progressDoc.data() : {};
        const readCount = Object.values(progress).filter(v => v === true).length;

        const div = document.createElement("div");
        div.textContent = `${userData.username} (${userData.clan}) — 📚 ${readCount} books`;

        communityDiv.appendChild(div);
      });
    });
  });
}
