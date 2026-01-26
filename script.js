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

// Initialize Firebase (avoid double-init if you ever add more scripts)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Services
const auth = firebase.auth();
const db = firebase.firestore();

// Real-time listeners
let communityUnsub = null;
let progressUnsubs = [];
let arcProgressUnsub = null;

// =====================
// DATA: BOOKS
// =====================
const arcs = {
  // MAIN SERIES ARCS
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

  // BEYOND THE MAIN ARCS
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
  "Manga": [
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
    "A Shadow in RiverClan",
    "Winds of Change",
    "Exile from ShadowClan",
    "A Thief in ThunderClan",
  ],
  "Graphic Novel Adaptations": [
    "The Prophecies Begin, Volume 1",
    "The Prophecies Begin, Volume 2",
    "The Prophecies Begin, Volume 3",
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
    "The Untold Stories",
    "Tales from the Clans",
    "Shadows of the Clans",
    "Legends of the Clans",
    "Path of a Warrior",
    "A Warrior’s Spirit",
    "A Warrior’s Choice",
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

// =====================
// DATA: CLAN LOGOS
// =====================
const clanLogos = {
  ThunderClan: "clans/thunderclan.png",
  RiverClan: "clans/riverclan.png",
  ShadowClan: "clans/shadowclan.png",
  WindClan: "clans/windclan.png",
  SkyClan: "clans/skyclan.png",
};

// Main-series list for arc progress (profile page)
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

// =====================
// AUTH: SIGN UP / LOGIN / LOGOUT
// =====================
function signUp() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;
  const username = document.getElementById("username")?.value?.trim();
  const clan = document.getElementById("clan")?.value;

  if (!email || !password || !username || !clan) {
    alert("Please fill out all fields");
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
    .then(() => {
      window.location.href = "profile.html";
    })
    .catch((err) => {
      console.error("Sign up failed:", err);
      alert(err.message);
    });
}

function logIn() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => (window.location.href = "profile.html"))
    .catch((err) => alert(err.message));
}

function logOut() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

function getCompletedMainArcs(progress) {
  const mainArcs = [
    "The Prophecies Begin",
    "The New Prophecy",
    "Power of Three",
    "Omen of the Stars",
    "Dawn of the Clans",
    "A Vision of Shadows",
    "The Broken Code",
    "A Starless Clan",
    "Changing Skies"
  ];

  const completed = [];

  mainArcs.forEach(arcName => {
    const books = arcs[arcName];
    if (!books) return;

    const finished = books.every(book => progress[book] === true);
    if (finished) completed.push(arcName);
  });

  return completed;
}

// =====================
// AUTH STATE / PAGE ROUTING
// =====================
auth.onAuthStateChanged((user) => {
  // Always load community on pages that have it
  if (document.getElementById("community")) {
    loadCommunity();
  }

  const protectedPages = ["app.html", "profile.html"];
  if (!user && protectedPages.some((p) => location.pathname.includes(p))) {
    window.location.href = "index.html";
    return;
  }

  if (!user) return;

  // Profile header + corner logo
  if (document.getElementById("welcome") || document.getElementById("clanLogo")) {
    loadUserHeader(user.uid);
  }

  // Profile arc progress
  if (document.getElementById("arcProgress")) {
    renderArcProgress(user.uid);
  }

  // Book tracker
  if (document.getElementById("books")) {
    showBooks(user.uid);
  }
});

// =====================
// PROFILE: HEADER + CLAN LOGO
// =====================
function loadUserHeader(uid) {
  db.collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      if (!doc.exists) return;
      const data = doc.data();

      const logo = document.getElementById("clanLogo");
      if (logo && clanLogos[data.clan]) {
        logo.src = clanLogos[data.clan];
        logo.style.display = "block";
      }

      const welcomeEl = document.getElementById("welcome");
      if (welcomeEl) {
        welcomeEl.textContent = `${data.username} of ${data.clan}`;
      }

      // Optional profile fields if you ever add them back
      const nameEl = document.getElementById("profileName");
      if (nameEl) nameEl.textContent = data.username;

      const clanEl = document.getElementById("profileClan");
      if (clanEl) clanEl.textContent = data.clan;
    });
}

// =====================
// PROFILE: ARC PROGRESS (shows arcs started)
// =====================
function renderArcProgress(uid) {
  const container = document.getElementById("arcProgress");
  if (!container) return;

  // Prevent multiple listeners
  if (arcProgressUnsub) arcProgressUnsub();

  arcProgressUnsub = db.collection("progress").doc(uid).onSnapshot((doc) => {
    const progress = doc.exists ? doc.data() : {};
    container.innerHTML = "";

    let startedAny = false;

    mainArcNames.forEach((arcName) => {
      const books = arcs[arcName] || [];
      if (books.length === 0) return;

      const readCount = books.filter((b) => progress[b] === true).length;
      const total = books.length;

      if (readCount === 0) return; // only started arcs
      startedAny = true;

      const pct = Math.round((readCount / total) * 100);

      const row = document.createElement("div");
      row.className = "arc-row";
      row.innerHTML = `
        <div class="arc-top">
          <span>${arcName}</span>
          <span>${readCount} / ${total} (${pct}%)</span>
        </div>
        <div class="arc-bar"><div style="width:${pct}%"></div></div>
      `;
      container.appendChild(row);
    });

    if (!startedAny) {
      container.textContent = "No arcs started yet. Start checking books in the tracker!";
    }
  });
}

// =====================
// BOOK TRACKER: CATEGORY FILTER
// =====================
function getCategoryForArc(arcName) {
  if (mainArcNames.includes(arcName)) return "Main Series";
  if (arcName === "Super Editions") return "Super Editions";
  if (arcName === "Manga") return "Manga";
  if (arcName === "Graphic Novel Adaptations") return "Graphic Novel Adaptations";
  if (arcName === "Novellas") return "Novellas";
  if (arcName === "Field Guides") return "Field Guides";
  return "Other";
}

// =====================
// BOOK TRACKER: SHOW BOOKS
// =====================
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

    // Start on Main Series once per page load
    filterEl.value = "Main Series";
  }

  function render() {
    const chosen = filterEl.value;
    booksDiv.innerHTML = "Loading...";

    db.collection("progress")
      .doc(uid)
      .get()
      .then((doc) => {
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
              db.collection("progress")
                .doc(uid)
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

  filterEl.onchange = render;
  render();
}

// =====================
// COMMUNITY: REAL-TIME PROGRESS
// =====================
function loadCommunity() {
  const communityDiv = document.getElementById("community");
  if (!communityDiv) return;

  if (communityUnsub) return;

  communityDiv.innerHTML = "Loading...";

  progressUnsubs.forEach(u => u && u());
  progressUnsubs = [];

  communityUnsub = db.collection("users").onSnapshot(snapshot => {
    communityDiv.innerHTML = "";

    if (snapshot.empty) {
      communityDiv.textContent = "No warriors yet. Be the first to join!";
      return;
    }

snapshot.forEach(userDoc => {
  const userId = userDoc.id;
  const userData = userDoc.data();

  // Compact user block
  const block = document.createElement("div");
  block.style.marginBottom = "18px";   // space between users
  block.style.lineHeight = "1.25";
  block.style.textAlign = "center";

  // Username + clan
  const nameLine = document.createElement("div");
  nameLine.textContent = `${userData.username} (${userData.clan})`;
  nameLine.style.fontSize = "1.05rem";
  nameLine.style.fontWeight = "600";
  nameLine.style.marginBottom = "2px";

  block.appendChild(nameLine);

  // Books read (smaller)
  const bookLine = document.createElement("div");
  bookLine.textContent = "📚 Books Read: 0";
  bookLine.style.fontSize = "0.8rem";
  bookLine.style.opacity = "0.85";
  bookLine.style.marginBottom = "1px";

  block.appendChild(bookLine);

  // Completed arcs (smallest)
  const arcLine = document.createElement("div");
  arcLine.textContent = "⭐ Completed Arcs: None";
  arcLine.style.fontSize = "0.75rem";
  arcLine.style.opacity = "0.75";

  block.appendChild(arcLine);

  communityDiv.appendChild(block);

  // Live progress listener
  const unsub = db.collection("progress").doc(userId).onSnapshot(progressDoc => {
    const progress = progressDoc.exists ? progressDoc.data() : {};

    const booksRead = Object.values(progress).filter(v => v === true).length;

    const completedArcs = Object.keys(arcs).filter(arcName => {
      const books = arcs[arcName];
      if (!books || books.length === 0) return false;
      return books.every(book => progress[book] === true);
    });

    bookLine.textContent = `📚 Books Read: ${booksRead}`;
    arcLine.textContent =
      completedArcs.length > 0
        ? `⭐ Completed Arcs: ${completedArcs.length}`
        : `⭐ Completed Arcs: None`;
  });

  progressUnsubs.push(unsub);
});



// =====================
// CLEANUP LISTENERS
// =====================
window.addEventListener("beforeunload", () => {
  if (communityUnsub) communityUnsub();
  progressUnsubs.forEach((u) => u && u());
  if (arcProgressUnsub) arcProgressUnsub();
});
