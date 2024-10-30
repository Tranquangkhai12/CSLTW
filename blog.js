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

const blogForm = document.getElementById("blogForm");
const postsContainer = document.getElementById("posts");

// Listen to form submission
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const postId = document.getElementById("postId").value;

  if (postId) {
    // Update post
    await db.collection("posts").doc(postId).update({
      title,
      content
    });
  } else {
    // Add new post
    await db.collection("posts").add({
      title,
      content
    });
  }

  // Reset form
  blogForm.reset();
  document.getElementById("postId").value = "";
  loadPosts();
});

// Load posts from Firestore
async function loadPosts() {
  postsContainer.innerHTML = ""; // Clear existing posts
  const snapshot = await db.collection("posts").get();
  snapshot.forEach(doc => {
    const post = doc.data();
    const postId = doc.id;

    // Create post element
    const postElement = document.createElement("div");
    postElement.classList.add("col-md-4", "mb-4");
    postElement.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.content}</p>
          <button class="btn btn-info" onclick="editPost('${postId}')">Edit</button>
          <button class="btn btn-danger" onclick="deletePost('${postId}')">Delete</button>
        </div>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Edit post
function editPost(postId) {
  const postElement = document.getElementById(postId);
  document.getElementById("title").value = postElement.querySelector(".card-title").innerText;
  document.getElementById("content").value = postElement.querySelector(".card-text").innerText;
  document.getElementById("postId").value = postId;
}

// Delete post
async function deletePost(postId) {
  await db.collection("posts").doc(postId).delete();
  loadPosts();
}

// Load posts on page load
loadPosts();
