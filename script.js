/* =====================
   COMMUNITY PAGE (CLAN SECTIONS + PLACARDS)
===================== */

.community-page {
  min-height: 100vh;
  background:
    linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)),
    url("images/profile-bg.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
  text-align: center;
}

.community-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: 3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 18px;
  text-shadow: 0 3px 12px rgba(0,0,0,0.85);
}

.community-sub {
  font-family: 'Cinzel Decorative', serif;
  opacity: 0.9;
  margin: 4px 0 10px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.85);
}

.community-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 18px auto 26px;
  flex-wrap: wrap;
}

.clan-section {
  max-width: 1050px;
  margin: 28px auto;
  padding: 0 14px;
}

.clan-header {
  font-family: 'Cinzel Decorative', serif;
  font-size: 2rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-shadow: 0 3px 12px rgba(0,0,0,0.9);
  margin: 10px 0 16px;
}

.clan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 900px) {
  .clan-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .clan-grid { grid-template-columns: 1fr; }
}

/* “Placard” card */
.placard {
  text-align: left;
  padding: 14px 14px 12px;
  border-radius: 14px;

  background: linear-gradient(
    rgba(255, 240, 210, 0.10),
    rgba(160, 110, 60, 0.10)
  );

  border: 1px solid rgba(255, 220, 170, 0.22);

  backdrop-filter: blur(2px);

  box-shadow:
    0 10px 26px rgba(0,0,0,0.55),
    inset 0 0 18px rgba(255, 220, 170, 0.06);
}

.placard-name {
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.25rem;
  letter-spacing: 1px;
  margin: 0 0 2px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.9);
}

.placard-meta {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.15;
  text-shadow: 0 2px 8px rgba(0,0,0,0.9);
}

.placard-bio {
  margin-top: 8px;
  font-size: 0.9rem;
  opacity: 0.95;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0,0,0,0.9);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
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

// Initialize Firebase (avoid double init)
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
// BIO: LOAD + PUBLISH
// =====================
function loadBio(uid) {
  const bioInput = document.getElementById("bioInput");
  if (!bioInput) return;

  db.collection("users").doc(uid).get().then((doc) => {
    if (!doc.exists) return;
    const data = doc.data();
    bioInput.value = data.bio || "";
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
  if (status) status.textContent = "Publishing...";

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
      if (status) status.textContent = "✅ Bio published!";
    })
    .catch((err) => {
      console.error("Bio publish failed:", err);
      if (status) status.textContent = "❌ Failed to publish bio.";
      alert(err.message);
    });
}

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

// =====================
// COMPLETED MAIN ARCS
// =====================
function getCompletedMainArcs(progress) {
  const completed = [];

  mainArcNames.forEach((arcName) => {
    const books = arcs[arcName];
    if (!books || books.length === 0) return;

    const finished = books.every((book) => progress[book] === true);
    if (finished) completed.push(arcName);
  });

  return completed;
}

// =====================
// AUTH STATE / PAGE ROUTING
// =====================
auth.onAuthStateChanged((user) => {
  // Always load community on pages that have it

  const protectedPages = ["app.html", "profile.html"];
  if (!user && protectedPages.some((p) => location.pathname.includes(p))) {
    window.location.href = "index.html";
    return;
  }

  if (!user) return;

  if (document.getElementById("communityClans")) {
  renderCommunityByClan();
}

function renderCommunityByClan() {
  const root = document.getElementById("communityClans");
  if (!root) return;

  const clans = ["ThunderClan", "RiverClan", "ShadowClan", "WindClan", "SkyClan"];

  // prevent duplicate listeners
  if (communityUnsub) return;

  root.innerHTML = "Loading...";

  // clear old per-user progress listeners
  progressUnsubs.forEach(u => u && u());
  progressUnsubs = [];

  communityUnsub = db.collection("users").onSnapshot(
    (snapshot) => {
      root.innerHTML = "";

      // bucket users by clan
      const buckets = {};
      clans.forEach(c => buckets[c] = []);

      snapshot.forEach(doc => {
        const u = doc.data();
        const uid = doc.id;
        const clan = u.clan || "Unknown";
        if (!buckets[clan]) buckets[clan] = [];
        buckets[clan].push({ uid, ...u });
      });

      clans.forEach((clanName) => {
        const section = document.createElement("div");
        section.className = "clan-section";

        const header = document.createElement("div");
        header.className = "clan-header";
        header.textContent = clanName;
        section.appendChild(header);

        const grid = document.createElement("div");
        grid.className = "clan-grid";
        section.appendChild(grid);

        const members = buckets[clanName] || [];

        if (members.length === 0) {
          const empty = document.createElement("div");
          empty.style.opacity = "0.85";
          empty.textContent = "No warriors yet.";
          section.appendChild(empty);
          root.appendChild(section);
          return;
        }

        members.forEach((member) => {
          const card = document.createElement("div");
          card.className = "placard";

          const name = document.createElement("div");
          name.className = "placard-name";
          name.textContent = member.username || "Unknown Warrior";
          card.appendChild(name);

          const meta1 = document.createElement("p");
          meta1.className = "placard-meta";
          meta1.textContent = `📚 Books Read: ...`;
          card.appendChild(meta1);

          const meta2 = document.createElement("p");
          meta2.className = "placard-meta";
          meta2.textContent = `⭐ Completed Main Arcs: ...`;
          card.appendChild(meta2);

          const bio = document.createElement("div");
          bio.className = "placard-bio";
          bio.textContent = member.bio ? `“${member.bio}”` : "No bio published.";
          card.appendChild(bio);

          grid.appendChild(card);

          // live progress for each user
          const unsub = db.collection("progress").doc(member.uid).onSnapshot((pdoc) => {
            const progress = pdoc.exists ? pdoc.data() : {};
            const booksRead = Object.values(progress).filter(v => v === true).length;

            // completed main arcs (uses your existing helper)
            const completedMain = getCompletedMainArcs(progress);

            meta1.textContent = `📚 Books Read: ${booksRead}`;
            meta2.textContent = `⭐ Completed Main Arcs: ${completedMain.length}`;
          });

          progressUnsubs.push(unsub);
        });

        root.appendChild(section);
      });
    },
    (err) => {
      console.error("Community page failed:", err);
      root.textContent = "Community failed to load.";
    }
  );
}



  // Header + clan logo + name/clan stack
  if (document.getElementById("welcome") || document.getElementById("clanLogo")) {
    loadUserHeader(user.uid);
  }

  // Bio load (profile page)
  if (document.getElementById("bioInput")) {
    loadBio(user.uid);
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
// PROFILE: HEADER + CLAN LOGO + NAME/CLAN STACK
// =====================
function loadUserHeader(uid) {
  db.collection("users").doc(uid).get().then((doc) => {
    if (!doc.exists) return;

    const data = doc.data();


    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl) {
      welcomeEl.innerHTML = `
        <div class="profile-name">${data.username}</div>
        <div class="profile-clan">${data.clan}</div>
      `;
    }
  });
}

// =====================
// PROFILE: ARC PROGRESS (shows arcs started)
// =====================
function renderArcProgress(uid) {
  const container = document.getElementById("arcProgress");
  if (!container) return;

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

      if (readCount === 0) return;
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
// COMMUNITY: REAL-TIME PROGRESS (compact)
// =====================
function loadCommunity() {
  const communityDiv = document.getElementById("community");
  if (!communityDiv) return;

  if (communityUnsub) return;

  communityDiv.innerHTML = "Loading...";

  // clean old per-user listeners
  progressUnsubs.forEach((u) => u && u());
  progressUnsubs = [];

  communityUnsub = db.collection("users").onSnapshot(
    (snapshot) => {
      communityDiv.innerHTML = "";

      if (snapshot.empty) {
        communityDiv.textContent = "No warriors yet. Be the first to join!";
        return;
      }

      snapshot.forEach((userDoc) => {
        const userId = userDoc.id;
        const userData = userDoc.data();

        const block = document.createElement("div");
        block.style.marginBottom = "16px"; // space only between users
        block.style.lineHeight = "1"; // no spacing between lines
        block.style.textAlign = "center";

        const nameLine = document.createElement("div");
        nameLine.textContent = `${userData.username} (${userData.clan})`;
        nameLine.style.fontSize = "1.05rem";
        nameLine.style.fontWeight = "600";
        nameLine.style.margin = "0";
        block.appendChild(nameLine);

        const bookLine = document.createElement("div");
        bookLine.textContent = "📚 Books Read: 0";
        bookLine.style.fontSize = "0.8rem";
        bookLine.style.opacity = "0.85";
        bookLine.style.margin = "0";
        block.appendChild(bookLine);

        const arcLine = document.createElement("div");
        arcLine.textContent = "⭐ Completed Main Arcs: None";
        arcLine.style.fontSize = "0.75rem";
        arcLine.style.opacity = "0.75";
        arcLine.style.margin = "0";
        block.appendChild(arcLine);

        communityDiv.appendChild(block);

        const unsub = db.collection("progress").doc(userId).onSnapshot((progressDoc) => {
          const progress = progressDoc.exists ? progressDoc.data() : {};
          const booksRead = Object.values(progress).filter((v) => v === true).length;
          const completedMain = getCompletedMainArcs(progress);

          bookLine.textContent = `📚 Books Read: ${booksRead}`;
          arcLine.textContent =
            completedMain.length > 0
              ? `⭐ Completed Main Arcs: ${completedMain.length}`
              : `⭐ Completed Main Arcs: None`;
        });

        progressUnsubs.push(unsub);
      });
    },
    (err) => {
      console.error("Community listener failed:", err);
      communityDiv.textContent = "Community failed to load.";
    }
  );
}

// =====================
// CLEANUP LISTENERS
// =====================
window.addEventListener("beforeunload", () => {
  if (communityUnsub) communityUnsub();
  progressUnsubs.forEach((u) => u && u());
  if (arcProgressUnsub) arcProgressUnsub();
});
