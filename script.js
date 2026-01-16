const firebaseConfig = {
  apiKey: "AIzaSyDxddG9tRkEU_wdtrX066CfYNnC7nwCpzM",
  authDomain: "warriorcatstracker.firebaseapp.com",
  projectId: "warriorcatstracker"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

<div id="auth">

  <input id="username" placeholder="Warrior Name (signup only)">
  <input id="email" placeholder="Email">
  <input id="password" type="password" placeholder="Password">

  <select id="clan">
    <option>ThunderClan</option>
    <option>RiverClan</option>
    <option>ShadowClan</option>
    <option>WindClan</option>
    <option>SkyClan</option>
  </select>

  <button onclick="signUp()">Create Warrior</button>
  <button onclick="logIn()">Log In</button>
  <button onclick="logOut()">Log Out</button>

</div>

auth.onAuthStateChanged(user => {
  if (!user) return;

  const booksDiv = document.getElementById("books");
  booksDiv.innerHTML = "";

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
