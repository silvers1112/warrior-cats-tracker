//Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

//arcs
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

//signUp
function signUp() { ... }

//LogIn
function logIn() { ... }

//LogOut
function logOut() { ... }


//auth.onAuthStateChanged

auth.onAuthStateChanged(user => {
  const booksDiv = document.getElementById("books");
  const authDiv = document.getElementById("auth");

  booksDiv.innerHTML = "";

    if (!user) {
    booksDiv.innerHTML = "<p>🔒 Log in to track your books.</p>";
    authDiv.style.display = "block";
    return;
  }

    authDiv.style.display = "none";
  showBooks(user.uid);
});
 
  Object.keys(arcs).forEach(arc => {
    const title = document.createElement("h3");
    title.textContent = arc;
    booksDiv.appendChild(title);

    arcs[arc].forEach(book => {
      const div = document.createElement("div");
      div.className = "book";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      checkbox.onchange = () => {
        db.collection("progress")
          .doc(user.uid)
          .set({ [book]: checkbox.checked }, { merge: true });
      };

      div.appendChild(checkbox);
      div.append(book);
      booksDiv.appendChild(div);
    });
  });
});


//Show books
function showBooks(uid) { ... }



