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
    "Into the Wild","Fire and Ice","Forest of Secrets",
    "Rising Storm","A Dangerous Path","The Darkest Hour"
  ],
  "The New Prophecy": [
    "Midnight","Moonrise","Dawn","Starlight","Twilight","Sunset"
  ],
  "Power of Three": [
    "The Sight","Dark River","Outcast",
    "Eclipse","Long Shadows","Sunrise"
  ]
};

// AUTH
function signUp() {
  auth.createUserWithEmailAndPassword(
    email.value, password.value
  ).then(cred => {
    return db.collection("users").doc(cred.user.uid).set({
      username: username.value,
      clan: clan.value
    });
  }).catch(e => alert(e.message));
}

function logIn() {
  auth.signInWithEmailAndPassword(
    email.value, password.value
  ).catch(e => alert(e.message));
}

function logOut() {
  auth.signOut();
}

// AUTH STATE
auth.onAuthStateChanged(user => {

  if (document.getElementById("community")) loadCommunity();

  if (!user) {
    if (onAppPage) window.location.href = "index.html";
    return;
  }

  if (onLandingPage) {
    window.location.href = "app.html";
    return;
  }

  loadUserHeader(user.uid);
  showBooks(user.uid);
});

// BOOK DISPLAY
function showBooks(uid) {
  books.innerHTML = "";

  db.collection("progress").doc(uid).get().then(doc => {
    const progress = doc.exists ? doc.data() : {};

    Object.keys(arcs).forEach(arc => {
      const h = document.createElement("h3");
      h.textContent = arc;
      books.appendChild(h);

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
        books.appendChild(d);
      });
    });
  });
}

// COMMUNITY
function loadCommunity() {
  community.innerHTML = "";
  db.collection("users").get().then(snap => {
    snap.forEach(u => {
      db.collection("progress").doc(u.id).get().then(p => {
        const count = p.exists
          ? Object.values(p.data()).filter(v => v).length
          : 0;
        const d = document.createElement("div");
        d.textContent = `${u.data().username} (${u.data().clan}) — ${count}`;
        community.appendChild(d);
      });
    });
  });
}

// HEADER
function loadUserHeader(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    welcome.textContent = `🐾 ${doc.data().username} of ${doc.data().clan}`;
  });
}
