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

// PAGE CHECK
const onLandingPage = window.location.pathname.includes("index");
const onAppPage = window.location.pathname.includes("app");

// Book arcs
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
  ],
  "Dawn of the Clans": [
    "The Sun Trail",
    "Thunder Rising",
    "The First Battle",
    "The Blazing Star",
    "A Forest Divided",
    "Path of Stars"
  ],
  "A Vision of Shadows": [
    "The Apprentice's Quest",
    "Thunder and Shadow",
    "Shattered Sky",
    "Darkest Night",
    "River of Secrets",
    "The Raging Storm"
  ],
  "The Broken Code": [
    "Warriors: Lost Stars",
    "Warriors: The Silent Thaw",
    "Warriors: Veil of Shadows",
    "Warriors: Darkness Within",
    "Warriors: A Light in the Mist",
    "Warriors: The Place of No Stars"
  ],
  "Super Editions": [
    "Firestar's Quest",
    "Bluestar's Prophecy",
    "Yellowfang's Secret",
    "Tawnykit's Curse",
    "Crowfeather's Trial",
    "Leafpool's Wish",
    "Mothwing's Secret",
    "Skyclan's Destiny",
    "Shattered Peace"
  ],
  "Novellas": [
    "Spottedleaf's Heart",
    "Hollyleaf's Story",
    "Squirrelflight's Hope",
    "Mistystar's Omen",
    "Pinestar's Choice",
    "Redtail's Debt",
    "Ravenpaw's Farewell"
  ],
  "Tallstar's Revenge": [
    "Tallstar's Revenge"
  ],
  "SkyClan and the Stranger": [
    "SkyClan and the Stranger",
    "SkyClan and the Stranger: The Rescue",
    "SkyClan and the Stranger: The Siege"
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
      const arcDiv = document.createElement("div");
      arcDiv.classList.add("arc");

      const arcTitle = document.createElement("h3");
      arcTitle.textContent = arc;
      arcDiv.appendChild(arcTitle);

      arcs[arc].forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = progress[book] === true;

        checkbox.onchange = () => {
          db.collection("progress").doc(uid)
            .set({ [book]: checkbox.checked }, { merge: true });
        };

        const bookTitle = document.createElement("h4");
        bookTitle.textContent = book;
        bookDiv.appendChild(checkbox);
        bookDiv.appendChild(bookTitle);
        arcDiv.appendChild(bookDiv);
      });

      booksDiv.appendChild(arcDiv);
    });
  });
}


// LOAD COMMUNITY
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

        const communityMember = document.createElement("div");
        communityMember.textContent = `${userData.username} (${userData.clan}) — 📚 ${readCount} books read`;

        communityDiv.appendChild(communityMember);
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
