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
// BOOK TRACKER DATA
// =====================
const arcs = {
  "The Prophecies Begin": [
    "Into the Wild",
    "Fire and Ice",
    "Forest of Secrets",
    "Rising Storm",
    "A Dangerous Path",
    "The Darkest Hour",
  ],
  "The New Prophecy": ["Midnight", "Moonrise", "Dawn", "Starlight", "Twilight", "Sunset"],
  "Power of Three": ["The Sight", "Dark River", "Outcast", "Eclipse", "Long Shadows", "Sunrise"],
  "Omen of the Stars": [
    "The Fourth Apprentice",
    "Fading Echoes",
    "Night Whispers",
    "Sign of the Moon",
    "The Forgotten Warrior",
    "The Last Hope",
  ],
  "Dawn of the Clans": [
    "The Sun Trail",
    "Thunder Rising",
    "The First Battle",
    "The Blazing Star",
    "A Forest Divided",
    "Path of Stars",
  ],
  "A Vision of Shadows": [
    "The Apprentice’s Quest",
    "Thunder and Shadow",
    "Shattered Sky",
    "Darkest Night",
    "River of Fire",
    "The Raging Storm",
  ],
  "The Broken Code": [
    "Lost Stars",
    "The Silent Thaw",
    "Veil of Shadows",
    "Darkness Within",
    "The Place of No Stars",
    "A Light in the Mist",
  ],
  "A Starless Clan": ["River", "Sky", "Shadow", "Thunder", "Wind", "Star"],
  "Changing Skies": ["The Elders’ Quest", "Hidden Moon"],

  "Super Editions": [
    "Firestar’s Quest",
    "Bluestar’s Prophecy",
    "SkyClan’s Destiny",
    "Crookedstar’s Promise",
    "Yellowfang’s Secret",
    "Tallstar’s Revenge",
    "Bramblestar’s Storm",
    "Moth Flight’s Vision",
    "Hawkwing’s Journey",
    "Tigerheart’s Shadow",
    "Crowfeather’s Trial",
    "Squirrelflight’s Hope",
    "Graystripe’s Vow",
    "Leopardstar’s Honor",
    "Onestar’s Confession",
    "Riverstar’s Home",
    "Ivypool’s Heart",
    "StormClan’s Folly",
  ],
  "Novellas": [
    "Hollyleaf’s Story",
    "Mistystar’s Omen",
    "Cloudstar’s Journey",
    "Tigerclaw’s Fury",
    "Leafpool’s Wish",
    "Dovewing’s Silence",
    "Mapleshade’s Vengeance",
    "Goosefeather’s Curse",
    "Ravenpaw’s Farewell",
  ],
  "Field Guides": [
    "Secrets of the Clans",
    "Cats of the Clans",
    "Code of the Clans",
    "Battles of the Clans",
    "Enter the Clans",
    "The Ultimate Guide",
    "The Ultimate Guide: Updated and Expanded Edition",
  ],
};

const mainArcNames = [
  "The Prophecies Begin",
  "The New Prophecy",
  "Power of Three",
  "Omen of the Stars",
  "Dawn of the Clans",
  "A Vision of Shadows",
  "The Broken Code",
  "A Starless Clan",
  "Changing Skies",
];

function getCategoryForArc(arcName) {
  if (mainArcNames.includes(arcName)) return "Main Series";
  if (arcName === "Super Editions") return "Super Editions";
  if (arcName === "Novellas") return "Novellas";
  if (arcName === "Field Guides") return "Field Guides";
  return "Other";
}

function showBooks(uid) {
  const booksDiv = document.getElementById("books");
  const filterEl = document.getElementById("categoryFilter");
  if (!booksDiv || !filterEl) return;

  // Build dropdown once
  if (filterEl.options.length === 0) {
    const categories = new Set();
    Object.keys(arcs).forEach((arcName) => categories.add(getCategoryForArc(arcName)));

    const sorted = Array.from(categories).sort((a, b) => a.localeCompare(b));
    if (sorted.includes("Main Series")) {
      sorted.splice(sorted.indexOf("Main Series"), 1);
      sorted.unshift("Main Series");
    }

    sorted.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filterEl.appendChild(opt);
    });

    filterEl.value = "Main Series";
  }

  function render() {
    const chosen = filterEl.value;
    booksDiv.innerHTML = "Loading...";

    db.collection("progress").doc(uid).get().then((doc) => {
      const progress = doc.exists ? doc.data() : {};
      booksDiv.innerHTML = "";

      Object.keys(arcs).forEach((arcName) => {
        if (getCategoryForArc(arcName) !== chosen) return;

        const arcDiv = document.createElement("div");
        arcDiv.className = "arc";

        const title = document.createElement("h3");
        title.textContent = arcName;
        arcDiv.appendChild(title);

        arcs[arcName].forEach((book) => {
          const bookDiv = document.createElement("div");
          bookDiv.className = "book";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = progress[book] === true;

          checkbox.onchange = () => {
            db.collection("progress").doc(uid).set({ [book]: checkbox.checked }, { merge: true });
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

  filterEl.onchange = render;
  render();
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

  if (user && isApp) {
  loadProfile(user.uid);     // shows name/clan at top
  showBooks(user.uid);       // loads book tracker
}

  // (Optional) If you later add app/community JS, you'd call it here safely:
  // if (user && isApp) { ... }
  // if (user && isCommunity) { ... }
});
