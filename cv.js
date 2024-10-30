// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const cvForm = document.getElementById("cvForm");
const cvDisplay = document.getElementById("cvDisplay");
const editButton = document.getElementById("editButton");

// Listen to form submission
cvForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const job = document.getElementById("job").value;
  const description = document.getElementById("description").value;
  const cvId = document.getElementById("cvId").value;

  if (cvId) {
    // Update existing CV
    await db.collection("cv").doc(cvId).update({
      name,
      job,
      description
    });
  } else {
    // Add new CV
    const docRef = await db.collection("cv").add({
      name,
      job,
      description
    });
    document.getElementById("cvId").value = docRef.id; // Save CV ID
  }

  // Reset form and load CV
  cvForm.reset();
  loadCV();
});

// Load CV from Firestore
async function loadCV() {
  const snapshot = await db.collection("cv").get();
  snapshot.forEach(doc => {
    const cv = doc.data();
    document.getElementById("displayName").innerText = cv.name;
    document.getElementById("displayJob").innerText = cv.job;
    document.getElementById("displayDescription").innerText = cv.description;
    document.getElementById("cvDisplay").style.display = "block";
    document.getElementById("cvId").value = doc.id; // Save CV ID for editing
  });
}

// Edit CV
editButton.addEventListener("click", () => {
  const name = document.getElementById("displayName").innerText;
  const job = document.getElementById("displayJob").innerText;
  const description = document.getElementById("displayDescription").innerText;

  document.getElementById("name").value = name;
  document.getElementById("job").value = job;
  document.getElementById("description").value = description;
});

// Load CV on page load
loadCV();
