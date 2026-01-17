alert("script.js loaded");


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

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

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
}

// LOG OUT
function logOut() {
  auth.signOut();
}

// AUTH STATE
auth.onAuthStateChanged(user => {
  const booksDiv = document.getElementById("books");
  const authDiv = document.getElementById("auth");

  booksDiv.innerHTML = "";

  if (!user) {
    authDiv.style.display = "block";
    document.getElementById("welcome").textContent = "";
    document.getElementById("logoutBtn").style.display = "none";
    booksDiv.innerHTML = "<p>🔒 Log in to track your books.</p>";
    return;
  }

  authDiv.style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline-block";
  
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
      const title = document.createElement("h3");
      title.textContent = arc;
      booksDiv.appendChild(title);

      arcs[arc].forEach(book => {
        const div = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = progress[book] === true;

        checkbox.onchange = () => {
          db.collection("progress")
            .doc(uid)
            .set({ [book]: checkbox.checked }, { merge: true });
        };

        div.appendChild(checkbox);
        div.append(" " + book);
        booksDiv.appendChild(div);
      });
    });
  });
}

function loadCommunity() {
  const communityDiv = document.getElementById("community");
  communityDiv.innerHTML = "<h3>📊 Community Progress</h3>";

  db.collection("users").get().then(snapshot => {
    snapshot.forEach(userDoc => {
      const userId = userDoc.id;
      const userData = userDoc.data();

      db.collection("progress").doc(userId).get().then(progressDoc => {
        const progress = progressDoc.exists ? progressDoc.data() : {};
        const readCount = Object.values(progress).filter(v => v === true).length;

        const div = document.createElement("div");
        div.innerHTML = `
          <strong>${userData.username}</strong>
          (${userData.clan}) — 📚 ${readCount} books read
        `;

        communityDiv.appendChild(div);
      });
    });
  });
}

function loadUserHeader(uid) {
  const welcome = document.getElementById("welcome");

  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();
    welcome.textContent = `🐾 ${data.username} of ${data.clan}`;
  });
}





