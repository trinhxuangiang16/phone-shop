// admin.js
// ---------------- CONFIG ----------------
const API_URL = "https://68c13f2b98c818a6940125be.mockapi.io/admin";
const tbody = document.querySelector("tbody");

// ---------------- HIỂN DANH SÁCH ----------------
function getProducts() {
  axios
    .get(API_URL)
    .then((res) => {
      renderTable(res.data);
    })
    .catch((err) => console.error(err));
}

function renderTable(products) {
  tbody.innerHTML = "";
  products.forEach((product, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${product.price.toLocaleString()} VND</td>
      <td><img src="${product.image}" width="50"/></td>
      <td>${product.description}</td>
      <td>
        <button onclick="deleteProduct('${product.id}')">❌</button>
        <button onclick="editProduct('${product.id}')">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------------- THÊM SẢN PHẨM ----------------
function addProduct(product) {
  if (!validateProduct(product)) return;
  axios
    .post(API_URL, product)
    .then(() => getProducts())
    .catch((err) => console.error(err));
}

// ---------------- XÓA SẢN PHẨM ----------------
function deleteProduct(id) {
  axios
    .delete(`${API_URL}/${id}`)
    .then(() => getProducts())
    .catch((err) => console.error(err));
}

// ---------------- CHUẨN BỊ SỬA ----------------
function editProduct(id) {
  axios
    .get(`${API_URL}/${id}`)
    .then((res) => {
      openModal(true, res.data);
    })
    .catch((err) => console.error(err));
}

// ---------------- CẬP NHẬT SẢN PHẨM ----------------
function updateProduct(id, newData) {
  if (!validateProduct(newData)) return;
  axios
    .put(`${API_URL}/${id}`, newData)
    .then(() => getProducts())
    .catch((err) => console.error(err));
}

// ---------------- VALIDATION ----------------
function validateProduct(product) {
  if (!product.name || !product.price || !product.image) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
    return false;
  }
  if (isNaN(product.price) || product.price <= 0) {
    alert("Giá sản phẩm không hợp lệ!");
    return false;
  }
  return true;
}

// ---------------- TÌM KIẾM THEO TÊN ----------------
function searchProducts(keyword) {
  axios
    .get(API_URL)
    .then((res) => {
      const result = res.data.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
      renderTable(result);
    })
    .catch((err) => console.error(err));
}

// ---------------- SẮP XẾP THEO GIÁ ----------------
function sortProducts(order = "asc") {
  axios
    .get(API_URL)
    .then((res) => {
      let sorted = res.data.sort((a, b) => {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      });
      renderTable(sorted);
    })
    .catch((err) => console.error(err));
}

// ---------------- MODAL ----------------
const modal = document.getElementById("productModal");
const form = document.getElementById("productForm");
let editingId = null;

function openModal(isEdit = false, product = null) {
  modal.style.display = "block";
  document.getElementById("modalTitle").innerText = isEdit
    ? "Edit Product"
    : "Add Product";

  if (isEdit && product) {
    editingId = product.id;
    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("image").value = product.image;
    document.getElementById("desc").value = product.description;
  } else {
    editingId = null;
    form.reset();
  }
}

function closeModal() {
  modal.style.display = "none";
}

// Khi bấm submit form
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const product = {
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    image: document.getElementById("image").value,
    description: document.getElementById("desc").value,
  };

  if (editingId) {
    updateProduct(editingId, product);
  } else {
    addProduct(product);
  }
  closeModal();
});

// ---------------- GẮN NÚT ----------------
document
  .querySelector(".card-header .btn")
  .addEventListener("click", () => openModal());

// ---------------- TÌM KIẾM REALTIME ----------------
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", function () {
  const keyword = this.value.trim();
  if (keyword === "") {
    getProducts(); // nếu ô tìm kiếm rỗng -> load lại toàn bộ
  } else {
    searchProducts(keyword);
  }
});

// ---------------- KHỞI TẠO ----------------
getProducts();
