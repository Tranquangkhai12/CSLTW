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

const productList = document.getElementById("product-list");
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");

// Add product event listener
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = productNameInput.value;
    const productPrice = productPriceInput.value;
    const productId = productIdInput.value;

    if (productId) {
        // Update existing product
        await db.collection("products").doc(productId).update({
            name: productName,
            price: parseFloat(productPrice)
        });
    } else {
        // Add new product
        await db.collection("products").add({
            name: productName,
            price: parseFloat(productPrice)
        });
    }

    productForm.reset();
    productIdInput.value = '';
    loadProducts();
});

// Load products from Firestore
async function loadProducts() {
    productList.innerHTML = '';
    const snapshot = await db.collection("products").get();
    snapshot.forEach(doc => {
        const product = doc.data();
        const productCard = document.createElement("div");
        productCard.classList.add("col-md-4", "mb-3");
        productCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Giá: ${product.price} VND</p>
                    <button class="btn btn-danger" onclick="deleteProduct('${doc.id}')">Xóa</button>
                    <button class="btn btn-warning" onclick="editProduct('${doc.id}', '${product.name}', ${product.price})" data-bs-toggle="modal" data-bs-target="#productModal">Chỉnh Sửa</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Delete product
async function deleteProduct(productId) {
    await db.collection("products").doc(productId).delete();
    loadProducts();
}

// Edit product
function editProduct(productId, name, price) {
    productIdInput.value = productId;
    productNameInput.value = name;
    productPriceInput.value = price;
}

// Load products on page load
loadProducts();
