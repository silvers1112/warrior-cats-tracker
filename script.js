// =====================
// FIREBASE CONFIG
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker",
  appId: "1:603975837840:web:00e1291a87bfec9742d015"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// =====================
// AUTH STATE
// =====================
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadProfile(user.uid);
  loadBio(user.uid);
});

// =====================
// LOAD PROFILE
// =====================
function loadProfile(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();
    document.getElementById("welcome").innerHTML = `
      <div class="profile-name">${data.username}</div>
      <div class="profile-clan">${data.clan}</div>
    `;
  });
}

// =====================
// BIOGRAPHY
// =====================
function loadBio(uid) {
  db.collection("users").doc(uid).get().then(doc => {
    if (!doc.exists) return;
    document.getElementById("bioInput").value = doc.data().bio || "";
  });
}

function publishBio() {
  const user = auth.currentUser;
  if (!user) return;

  const bio = document.getElementById("bioInput").value.trim();
  const status = document.getElementById("bioStatus");

  status.textContent = "Saving...";

  db.collection("users").doc(user.uid).set(
    { bio },
    { merge: true }
  ).then(() => {
    status.textContent = "✅ Bio saved";
  }).catch(err => {
    status.textContent = "❌ Error";
    console.error(err);
  });
}

// =====================
// LOG OUT
// =====================
function logOut() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

