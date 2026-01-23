console.log("script.js loaded");

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

let communityUnsub = null;
let progressUnsubs = [];


// =====================
// WARRIOR CAT ARCS
// =====================
const arcs = {
  // =====================
  // MAIN SERIES ARCS
  // =====================
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
    "The Apprentice’s Quest",
    "Thunder and Shadow",
    "Shattered Sky",
    "Darkest Night",
    "River of Fire",
    "The Raging Storm"
  ],

  "The Broken Code": [
    "Lost Stars",
    "The Silent Thaw",
    "Veil of Shadows",
    "Darkness Within",
    "The Place of No Stars",
    "A Light in the Mist"
  ],

  "A Starless Clan": [
    "River",
    "Sky",
    "Shadow",
    "Thunder",
    "Wind",
    "Star"
  ],

  "Changing Skies": [
    "The Elders’ Quest",
    "Hidden Moon"
  ],

  // =====================
  // BEYOND THE MAIN ARCS
  // =====================

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
    "StormClan’s Folly"
  ],

  "Manga": [
    // Omnibus labels shown on the official list
    "Warriors: Graystripe’s Adventure",
    "The Lost Warrior",
    "Warrior’s Refuge",
    "Warrior’s Return",

    "The Rise of Scourge (full color)",
    "The Rise of Scourge",

    "Into the Woods",
    "Escape from the Forest",
    "Return to the Clans",

    "Warriors: Ravenpaw’s Path",
    "Shattered Peace",
    "A Clan in Need",
    "The Heart of a Warrior",

    "Warriors: SkyClan and the Stranger",
    "The Rescue",
    "After the Flood",
    "Beyond the Code",

    // Stand-alone graphic novels listed under Manga on the official page
    "A Shadow in RiverClan",
    "Winds of Change",
    "Exile from ShadowClan",
    "A Thief in ThunderClan"
  ],

  "Graphic Novel Adaptations": [
    "The Prophecies Begin, Volume 1",
    "The Prophecies Begin, Volume 2",
    "The Prophecies Begin, Volume 3"
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

    // Collections shown on the official list
    "The Untold Stories",
    "Tales from the Clans",
    "Shadows of the Clans",
    "Legends of the Clans",
    "Path of a Warrior",
    "A Warrior’s Spirit",
    "A Warrior’s Choice"
  ],

  "Field Guides": [
    "Secrets of the Clans",
    "Cats of the Clans",
    "Code of the Clans",
    "Battles of the Clans",
    "Enter the Clans",
    "The Ultimate Guide",
    "The Ultimate Guide: Updated and Expanded Edition"
  ]
};


// =====================
// LOAD USER HEADER FUNCTION (Fixed position)
// =====================
function loadUserHeader(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl) {
      welcomeEl.textContent = `🐾 ${data.username} of ${data.clan}`;
    }

    const nameEl = document.getElementById("profileName");
    if (nameEl) nameEl.textContent = data.username;

    const clanEl = document.getElementById("profileClan");
    if (clanEl) clanEl.textContent = data.clan;
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
      window.location.href = "profile.html";
;
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
    .then(() => window.location.href = "profile.html")
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

  // ✅ Always load community (home page + app page)
  if (document.getElementById("community")) {
    loadCommunity();
  }

  // Redirect if not logged in and trying to view app.html
  const protectedPages = ["app.html", "profile.html"];

if (!user && protectedPages.some(p => location.pathname.includes(p))) {
  window.location.href = "index.html";
  return;
}


  // Only user-specific stuff when logged in
  if (user) {
    if (document.getElementById("welcome")) {
      loadUserHeader(user.uid);
    }

    if (document.getElementById("books")) {
      showBooks(user.uid);
    }
  }
});


function getCategoryForArc(arcName) {
  // Main series arcs (your 9 main arcs)
  const mainArcs = new Set([
    "The Prophecies Begin",
    "The New Prophecy",
    "Power of Three",
    "Omen of the Stars",
    "Dawn of the Clans",
    "A Vision of Shadows",
    "The Broken Code",
    "A Starless Clan",
    "Changing Skies"
  ]);

  if (mainArcs.has(arcName)) return "Main Series";
  if (arcName === "Super Editions") return "Super Editions";
  if (arcName === "Manga") return "Manga";
  if (arcName === "Graphic Novel Adaptations") return "Graphic Novel Adaptations";
  if (arcName === "Novellas") return "Novellas";
  if (arcName === "Field Guides") return "Field Guides";

  // fallback
  return "Other";
}

// =====================
// SHOW BOOKS
// =====================
function showBooks(uid) {
  const booksDiv = document.getElementById("books");
  const filterEl = document.getElementById("categoryFilter");
  if (!booksDiv || !filterEl) return;

  booksDiv.innerHTML = "";

  // Build dropdown options
  const categories = new Set();
  Object.keys(arcs).forEach(arcName => categories.add(getCategoryForArc(arcName)));

  const sortedCategories = Array.from(categories).sort((a, b) => a.localeCompare(b));

  // Put "Main Series" first if it exists
  if (sortedCategories.includes("Main Series")) {
    sortedCategories.splice(sortedCategories.indexOf("Main Series"), 1);
    sortedCategories.unshift("Main Series");
  }

  // Populate dropdown only once
  if (filterEl.options.length === 0) {
    sortedCategories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filterEl.appendChild(opt);
    });
  }

// Always start on Main Series when the app loads
// Start on Main Series when arriving on the tracker page
if (!filterEl.dataset.initialized) {
  filterEl.value = "Main Series";
  filterEl.dataset.initialized = "true";
}


  function render() {
    const chosen = filterEl.value;
    localStorage.setItem("booksFilter", chosen);

    booksDiv.innerHTML = "";

    db.collection("progress").doc(uid).get().then(doc => {
      const progress = doc.exists ? doc.data() : {};

      Object.keys(arcs).forEach(arcName => {
        if (getCategoryForArc(arcName) !== chosen) return;

        const arcDiv = document.createElement("div");
        arcDiv.className = "arc";

        const title = document.createElement("h3");
        title.textContent = arcName;
        arcDiv.appendChild(title);

        arcs[arcName].forEach(book => {
          const bookDiv = document.createElement("div");
          bookDiv.className = "book";

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

  // Re-render when dropdown changes
  filterEl.onchange = render;

  // Initial render
  render();
}

// =====================
// LOAD COMMUNITY
// =====================
function loadCommunity() {
  const communityDiv = document.getElementById("community");
  if (!communityDiv) return;

  // Prevent duplicate listeners
  if (communityUnsub) return;

  communityDiv.innerHTML = "Loading...";

  // Clean up old progress listeners
  progressUnsubs.forEach(u => u && u());
  progressUnsubs = [];

  // Live listener for users
  communityUnsub = db.collection("users").onSnapshot(
    (snapshot) => {
      communityDiv.innerHTML = "";

      if (snapshot.empty) {
        communityDiv.textContent = "No warriors yet. Be the first to join!";
        return;
      }

      snapshot.forEach(userDoc => {
        const userId = userDoc.id;
        const userData = userDoc.data();

        // Create row
        const row = document.createElement("div");
        row.textContent = `${userData.username} (${userData.clan}) — 📚 0 books`;
        communityDiv.appendChild(row);

        // Live listener for this user's progress
        const unsub = db.collection("progress").doc(userId).onSnapshot(
          (progressDoc) => {
            const progress = progressDoc.exists ? progressDoc.data() : {};
            const readCount = Object.values(progress).filter(v => v === true).length;

            row.textContent = `${userData.username} (${userData.clan}) — 📚 ${readCount} books`;
          }
        );

        progressUnsubs.push(unsub);
      });
    },
    (err) => {
      console.error("Community listener failed:", err);
      communityDiv.textContent = "Community failed to load.";
    }
  );
}

window.addEventListener("beforeunload", () => {
  if (communityUnsub) communityUnsub();
  progressUnsubs.forEach(u => u && u());
});

