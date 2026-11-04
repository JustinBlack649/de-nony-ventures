// EDIT THIS LIST to add your real products. Prices are in Nigerian naira.
const products = [
  { id: 1, name: "Everyday Shirt", category: "Clothes", price: 12500, symbol: "👕", tag: "Clothing", bg: "#e8d9c8" },
  { id: 2, name: "Classic Sneakers", category: "Clothes", price: 28000, symbol: "👟", tag: "Popular", bg: "#d9e0d8" },
  { id: 3, name: "The Daily Shades", category: "Accessories", price: 15000, symbol: "🕶️", tag: "", bg: "#e5d9d3" },
  { id: 4, name: "Everyday Handbag", category: "Accessories", price: 18500, symbol: "👜", tag: "Bestseller", bg: "#e6dfc9" },
  { id: 5, name: "Body Lotion", category: "Cosmetics", price: 8500, symbol: "🧴", tag: "", bg: "#e8d8c6" },
  { id: 6, name: "Beauty Set", category: "Cosmetics", price: 14500, symbol: "🧼", tag: "New", bg: "#d9d6e2" },
  { id: 7, name: "Electric Kettle", category: "Appliances", price: 22000, symbol: "🫖", tag: "Home", bg: "#e9dfc7" },
  { id: 8, name: "Table Fan", category: "Appliances", price: 35000, symbol: "🌀", tag: "", bg: "#d5e1df" }
];

const affProducts = [
  { id: 101, name: "AFF Branded Rice", category: "AFF Collection", price: 0, symbol: "🌾", pack: "pack-rice", label: "AFF PREMIUM RICE", detail: "LONG GRAIN · QUALITY", tag: "Customized", bg: "#e8d9c8" },
  { id: 102, name: "AFF Perfume", category: "AFF Collection", price: 0, symbol: "🧴", pack: "pack-perfume", label: "AFF", detail: "EAU DE PARFUM", tag: "Customized", bg: "#e5d9d3" },
  { id: 103, name: "AFF Body Wash", category: "AFF Collection", price: 0, symbol: "🫧", pack: "pack-bodywash", label: "AFF BODY WASH", detail: "GENTLE CARE", tag: "Customized", bg: "#d9e0d8" },
  { id: 104, name: "AFF Wines", category: "AFF Collection", price: 0, symbol: "🍾", pack: "pack-wine", label: "AFF WINE", detail: "RESERVE COLLECTION", tag: "Customized", bg: "#e6dfc9" },
  { id: 105, name: "AFF Bottled Water", category: "AFF Collection", price: 0, symbol: "💧", pack: "pack-water", label: "AFF", detail: "PURE WATER", tag: "Customized", bg: "#d5e1df" }
];

products.push(...affProducts);

// Add your WhatsApp number in international format, without + or spaces.
const WHATSAPP_NUMBER = "2348000000000";
const money = value => "₦" + value.toLocaleString("en-NG");

let cart = [];
let activeCategory = "All";

const grid = document.getElementById("productGrid");
const search = document.getElementById("search");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function showAuthPage(page) {
  document.getElementById("authHomeLink")
    .classList.toggle("active", Boolean(page));
  document.querySelectorAll(".auth-area").forEach(section => {
    section.classList.toggle("active", section.id === page);
  });

document.getElementById("authHomeLink").addEventListener("click", event => {
  event.preventDefault();
  history.replaceState(null, "", location.pathname + location.search);
  showAuthPage("");
});

  document.querySelectorAll(".app > section:not(.auth-area), .app > footer")
    .forEach(section => section.style.display = page ? "none" : "");

  document.querySelector(".app > header").style.display = page ? "none" : "";
  document.querySelector(".announcement").style.display = page ? "none" : "";

  if (page) {
    document.getElementById(page).scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.querySelectorAll("[data-auth]").forEach(control => {
  control.addEventListener("click", event => {
    event.preventDefault();
    showAuthPage(control.dataset.auth);
  });
});

document.getElementById("registerForm").addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const message = document.getElementById("registerMessage");

  if (data.get("password") !== data.get("confirmPassword")) {
    message.textContent = "Your passwords do not match.";
    return;
  }

  message.textContent = "Registration form validated. Connect a secure backend to create and save accounts.";
});

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("loginMessage").textContent =
    "Login form validated. Connect a secure backend to verify account details.";
});

window.addEventListener("hashchange", () => {
  const page = ["register", "login"].includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : "";
  showAuthPage(page);
});

function renderProducts() {
  const term = search.value.trim().toLowerCase();

  const visible = products.filter(p =>
    p.category !== "AFF Collection" &&
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
  );

  grid.innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <div class="product-visual" style="--product-bg:${p.bg}">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <span class="product-symbol" aria-hidden="true">${p.symbol}</span>
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-name">${p.name}</span>
          <span class="product-price">${money(p.price)}</span>
        </div>
        <div class="product-category">${p.category}</div>
        <button class="add-button" onclick="addToCart(${p.id})">Add to bag +</button>
      </div>
    </article>
  `).join("") : `<div class="empty">No pieces found. Try another search.</div>`;
}

function renderAffProducts() {
  document.getElementById("affProductGrid").innerHTML = affProducts.map(p => `
    <article class="product-card">
      <div class="product-visual" style="--product-bg:${p.bg}">
        <span class="tag">${p.tag}</span>
        <div class="aff-pack ${p.pack}" role="img" aria-label="AFF ${p.name} packaging concept">
          <div class="aff-pack-label">${p.label}<small>${p.detail}</small></div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-name">${p.name}</span>
          <span class="product-price">Enquire</span>
        </div>
        <div class="product-category">${p.category} · Packaging concept</div>
        <button class="add-button" onclick="notify('Contact us for AFF product details and pricing')">Enquire about product ↗</button>
      </div>
    </article>
  `).join("");
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  renderCart();
  notify("Added to your bag");
}

function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const total = cart.reduce((sum, item) =>
    sum + products.find(p => p.id === item.id).price * item.qty, 0
  );

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(item => {
        const p = products.find(x => x.id === item.id);

        return `
          <div class="cart-row">
            <div class="cart-thumb">${p.symbol}</div>
            <div>
              <strong>${p.name}</strong>
              <small>${money(p.price)}</small>
              <div class="qty">
                <button onclick="changeQty(${p.id},-1)" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${p.id},1)" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button class="remove" onclick="changeQty(${p.id},-${item.qty})">Remove</button>
          </div>
        `;
      }).join("")
    : `<div class="cart-empty">Your bag is taking a little breather.<br>Add something lovely from the collection.</div>`;

  document.getElementById("checkout").disabled = !cart.length;
  document.getElementById("checkout").style.opacity = cart.length ? "1" : ".45";
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(x => {
    x.classList.toggle("active", x === button);
  });

  renderProducts();
});

document.querySelectorAll("[data-jump-category]").forEach(link => {
  link.addEventListener("click", () => {
    activeCategory = link.dataset.jumpCategory;

    document.querySelectorAll(".filter").forEach(x => {
      x.classList.toggle("active", x.dataset.category === activeCategory);
    });

    renderProducts();
    document.querySelector(".goods-menu").removeAttribute("open");
  });
});

document.querySelectorAll("[data-category-jump]").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.categoryJump;

    document.querySelectorAll(".filter").forEach(x => {
      x.classList.toggle("active", x.dataset.category === activeCategory);
    });

    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

search.addEventListener("input", renderProducts);

document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) return;

  if (WHATSAPP_NUMBER === "2348000000000") {
    notify("Add your WhatsApp number in the script first");
    return;
  }

  const lines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `${p.name} x${item.qty} = ${money(p.price * item.qty)}`;
  });

  const total = cart.reduce((sum, item) =>
    sum + products.find(p => p.id === item.id).price * item.qty, 0
  );

  const message = `Hello AFF! I'd like to place an order:\n${lines.join("\n")}\n\nTotal: ${money(total)}`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener"
  );
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderAffProducts();
renderCart();

if (["#register", "#login"].includes(location.hash)) {
  showAuthPage(location.hash.slice(1));
}