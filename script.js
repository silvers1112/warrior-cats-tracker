const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const clan = document.getElementById("clan").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // Save warrior profile
      return db.collection("users").doc(cred.user.uid).set({
        username: username,
        clan: clan
      });
    })
    .then(() => {
      alert("Welcome to the Clans!");
    })
    .catch(error => {
      alert(error.message);
    });
}

const arcs = {
  "The Prophecies Begin": [
    "Into the Wild","Fire and Ice","Forest of Secrets",
    "Rising Storm","A Dangerous Path","The Darkest Hour"
  ],
  "The New Prophecy": [
    "Midnight","Moonrise","Dawn","Starlight","Twilight","Sunset"
  ],
  "Power of Three": [
    "The Sight","Dark River","Outcast","Eclipse","Long Shadows","Sunrise"
  ]
};
