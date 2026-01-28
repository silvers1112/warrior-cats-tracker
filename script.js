console.log("script.js loaded");

/* =====================
   FIREBASE CONFIG
===================== */
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

/* =====================
   HELPERS
===================== */
function currentFile() {
  const p = window.location.pathname;
  const parts = p.split("/").filter(Boolean);
  return (parts[parts.length - 1] || "index.html").toLowerCase();
}
function isPage(file) {
  return currentFile() === file.toLowerCase();
}
function go(page) {
  window.location.href = page;
}

/* =====================
   AUTH ACTIONS
===================== */
function logIn() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) return alert("Enter email and password");

  auth.signInWithEmailAndPassword(email, password)
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

  auth.createUserWithEmailAndPassword(email, password)
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

/* =====================
   PROFILE: NAME/CLAN + BIO
===================== */
function loadProfile(uid) {
  const welcomeEl = document.getElementById("welcome");
  if (!welcomeEl) return;

  db.collection("users").doc(uid).get()
    .then((doc) => {
      if (!doc.exists) return;
      const data = doc.data();
      welcomeEl.innerHTML = `
        <div class="profile-name">${data.username || ""}</div>
        <div class="profile-clan">${data.clan || ""}</div>
      `;
    })
    .catch((err) => console.error("loadProfile failed:", err));
}

function loadBio(uid) {
  const bioInput = document.getElementById("bioInput");
  if (!bioInput) return;

  db.collection("users").doc(uid).get()
    .then((doc) => {
      if (!doc.exists) return;
      bioInput.value = doc.data().bio || "";
    })
    .catch((err) => console.error("loadBio failed:", err));
}

function publishBio() {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to publish your bio.");

  const bioInput = document.getElementById("bioInput");
  const status = document.getElementById("bioStatus");
  if (!bioInput) return;

  const bio = bioInput.value.trim();
  if (status) status.textContent = "Saving...";

  db.collection("users").doc(user.uid).set(
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

/* =====================
   BOOK TRACKER DATA
===================== */
const arcs = {
  "The Prophecies Begin": [
    "Into the Wild", "Fire and Ice", "Forest of Secrets",
    "Rising Storm", "A Dangerous Path", "The Darkest Hour"
  ],
  "The New Prophecy": ["Midnight", "Moonrise", "Dawn", "Starlight", "Twilight", "Sunset"],
  "Power of Three": ["The Sight", "Dark River", "Outcast", "Eclipse", "Long Shadows", "Sunrise"],
  "Omen of the Stars": [
    "The Fourth Apprentice", "Fading Echoes", "Night Whispers",
    "Sign of the Moon", "The Forgotten Warrior", "The Last Hope"
  ],
  "Dawn of the Clans": [
    "The Sun Trail", "Thunder Rising", "The First Battle",
    "The Blazing Star", "A Forest Divided", "Path of Stars"
  ],
  "A Vision of Shadows": [
    "The Apprentice’s Quest", "Thunder and Shadow", "Shattered Sky",
    "Darkest Night", "River of Fire", "The Raging Storm"
  ],
  "The Broken Code": [
    "Lost Stars", "The Silent Thaw", "Veil of Shadows",
    "Darkness Within", "The Place of No Stars", "A Light in the Mist"
  ],
  "A Starless Clan": ["River", "Sky", "Shadow", "Thunder", "Wind", "Star"],
  "Changing Skies": ["The Elders’ Quest", "Hidden Moon"],

  "Super Editions": [
    "Firestar’s Quest", "Bluestar’s Prophecy", "SkyClan’s Destiny",
    "Crookedstar’s Promise", "Yellowfang’s Secret", "Tallstar’s Revenge",
    "Bramblestar’s Storm", "Moth Flight’s Vision", "Hawkwing’s Journey",
    "Tigerheart’s Shadow", "Crowfeather’s Trial", "Squirrelflight’s Hope",
    "Graystripe’s Vow", "Leopardstar’s Honor", "Onestar’s Confession",
    "Riverstar’s Home", "Ivypool’s Heart", "StormClan’s Folly"
  ],
  "Novellas": [
    "Hollyleaf’s Story", "Mistystar’s Omen", "Cloudstar’s Journey",
    "Tigerclaw’s Fury", "Leafpool’s Wish", "Dovewing’s Silence",
    "Mapleshade’s Vengeance", "Goosefeather’s Curse", "Ravenpaw’s Farewell"
  ],
  "Field Guides": [
    "Secrets of the Clans", "Cats of the Clans", "Code of the Clans",
    "Battles of the Clans", "Enter the Clans", "The Ultimate Guide",
    "The Ultimate Guide: Updated and Expanded Edition"
  ],
};

const mainArcNames = [
  "The Prophecies Begin", "The New Prophecy", "Power of Three",
  "Omen of the Stars", "Dawn of the Clans", "A Vision of Shadows",
  "The Broken Code", "A Starless Clan", "Changing Skies"
];

function getCategoryForArc(arcName) {
  if (mainArcNames.includes(arcName)) return "Main Series";
  if (arcName === "Super Editions") return "Super Editions";
  if (arcName === "Novellas") return "Novellas";
  if (arcName === "Field Guides") return "Field Guides";
  return "Other";
}

/* =====================
   BOOK TRACKER (REAL-TIME)
===================== */
let progressUnsubSelf = null;

function showBooks(uid) {
  const booksDiv = document.getElementById("books");
  const filterEl = document.getElementById("categoryFilter");
  if (!booksDiv || !filterEl) return;

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

  if (progressUnsubSelf) progressUnsubSelf();
  progressUnsubSelf = db.collection("progress").doc(uid).onSnapshot(
    (doc) => {
      const progress = doc.exists ? doc.data() : {};
      renderBooksUI(uid, progress);
    },
    (err) => {
      console.error("Progress listener failed:", err);
      booksDiv.innerHTML = "❌ Could not load books (Firestore rules blocking reads).";
    }
  );

  filterEl.onchange = () => {
    db.collection("progress").doc(uid).get().then((doc) => {
      const progress = doc.exists ? doc.data() : {};
      renderBooksUI(uid, progress);
    });
  };
}

function renderBooksUI(uid, progress) {
  const booksDiv = document.getElementById("books");
  const filterEl = document.getElementById("categoryFilter");
  if (!booksDiv || !filterEl) return;

  const chosen = filterEl.value;
  booksDiv.innerHTML = "";

  Object.keys(arcs).forEach((arcName) => {
    if (getCategoryForArc(arcName) !== chosen) return;

    const arcDiv = document.createElement("div");
    arcDiv.className = "arc";

    const title = document.createElement("h3");
    title.textContent = arcName;
    arcDiv.appendChild(title);

    arcs[arcName].forEach((book) => {
      const row = document.createElement("div");
      row.className = "book";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = progress[book] === true;

      checkbox.onchange = () => {
        db.collection("progress").doc(uid).set({ [book]: checkbox.checked }, { merge: true });
      };

      const label = document.createElement("span");
      label.textContent = book;

      row.appendChild(checkbox);
      row.appendChild(label);
      arcDiv.appendChild(row);
    });

    booksDiv.appendChild(arcDiv);
  });
}

/* =====================
   COMMUNITY: 4 CLAN BOXES (TOP LEVEL)
===================== */
let communityUnsub = null;
let communityProgressUnsubs = [];

function getMainArcProgressPercent(progress) {
  let total = 0;
  let read = 0;

  mainArcNames.forEach((arcName) => {
    const books = arcs[arcName] || [];
    total += books.length;
    books.forEach((b) => {
      if (progress[b] === true) read += 1;
    });
  });

  return total === 0 ? 0 : Math.round((read / total) * 100);
}

function renderCommunity4Clans() {
  const thunder = document.getElementById("clanThunder");
  const river = document.getElementById("clanRiver");
  const shadow = document.getElementById("clanShadow");
  const wind = document.getElementById("clanWind");
  if (!thunder || !river || !shadow || !wind) return;

  const clanTargets = {
    ThunderClan: thunder,
    RiverClan: river,
    ShadowClan: shadow,
    WindClan: wind,
  };

  if (communityUnsub) return;

  communityProgressUnsubs.forEach((u) => u && u());
  communityProgressUnsubs = [];

  Object.values(clanTargets).forEach((el) => (el.innerHTML = "Loading..."));

  communityUnsub = db.collection("users").onSnapshot(
    (snapshot) => {
      Object.values(clanTargets).forEach((el) => (el.innerHTML = ""));

      if (snapshot.empty) {
        Object.values(clanTargets).forEach((el) => (el.innerHTML = "<div>No warriors yet.</div>"));
        return;
      }

      snapshot.forEach((userDoc) => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        const target = clanTargets[userData.cl

        /* Safety: ignore SkyClan + anything else */
        if (!target) return;

        const card = document.createElement("div");
        card.className = "warrior-card";

        const nameEl = document.createElement("div");
        nameEl.className = "warrior-name";
        nameEl.textContent = userData.username || "Unknown Warrior";

        const statsEl = document.createElement("div");
        statsEl.className = "warrior-stats";
        statsEl.textContent = "📚 Books Read: 0 • ⭐ Main Arc Progress: 0%";

        const bioEl = document.createElement("div");
        bioEl.className = "warrior-bio";
        const bio = (userData.bio || "").trim();
        bioEl.textContent = bio
          ? `“${bio.slice(0, 120)}${bio.length > 120 ? "…" : ""}”`
          : "No bio published.";

        card.appendChild(nameEl);
        card.appendChild(statsEl);
        card.appendChild(bioEl);
        target.appendChild(card);

        const unsub = db.collection("progress").doc(uid).onSnapshot((pdoc) => {
          const progress = pdoc.exists ? pdoc.data() : {};
          const booksRead = Object.values(progress).filter((v) => v === true).length;
          const pct = getMainArcProgressPercent(progress);
          statsEl.textContent = `📚 Books Read: ${booksRead} • ⭐ Main Arc Progress: ${pct}%`;
        });

        communityProgressUnsubs.push(unsub);
      });

      Object.values(clanTargets).forEach((el) => {
        if (el.children.length === 0) el.innerHTML = "<div>No warriors yet.</div>";
      });
    },
    (err) => {
      console.error("Community load failed:", err);
      Object.values(clanTargets).forEach((el) => (el.innerHTML = "❌ Community failed to load."));
    }
  );
}

/* Cleanup */
window.addEventListener("beforeunload", () => {
  if (communityUnsub) communityUnsub();
  communityProgressUnsubs.forEach((u) => u && u());
  if (progressUnsubSelf) progressUnsubSelf();
});

/* =====================
   AUTH ROUTING
===================== */
auth.onAuthStateChanged((user) => {
  const isLogin = isPage("login.html");
  const isSignup = isPage("signup.html");
  const isProfile = isPage("profile.html");
  const isApp = isPage("app.html");
  const isCommunity = isPage("community.html");

  if (!user && (isProfile || isApp || isCommunity)) {
    go("index.html");
    return;
  }

  if (user && (isLogin || isSignup)) {
    go("profile.html");
    return;
  }

  if (user && isProfile) {
    loadProfile(user.uid);
    if (document.getElementById("bioInput")) loadBio(user.uid);
  }

  if (user && isApp) {
    loadProfile(user.uid);
    showBooks(user.uid);
  }

  if (user && isCommunity) {
    renderCommunity4Clans();
  }
});
