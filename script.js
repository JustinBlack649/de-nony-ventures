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

document.getElementById("authHomeLink").addEventListener("click", event => {
  event.preventDefault();
  history.replaceState(null, "", location.pathname + location.search);
  showAuthPage("");
});

document.querySelectorAll("[data-auth]").forEach(control => {
  control.addEventListener("click", event => {
    event.preventDefault();
    showAuthPage(control.dataset.auth);
  });
});

// Supabase project configuration. The publishable key is intended for browser use.
const SUPABASE_URL = "https://feakzaogeaftafasvhne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xoqCFXxKxXf_-CvYeBhLcw_cQdsD3j8";

if (!window.supabase?.createClient) {
  throw new Error("Supabase library did not load. Check your internet connection and refresh.");
}
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

function setAuthMessage(id, message, isError = false) {
  const element = document.getElementById(id);
  element.textContent = message;
  element.style.color = isError ? "#b42318" : "#176b43";
}

function updateAccountUI(session) {
  const links = document.querySelector(".account-links");
  const login = links.querySelector('[data-auth="login"]');
  const register = links.querySelector('[data-auth="register"]');
  let status = document.getElementById("accountStatus");
  let logout = document.getElementById("logoutButton");
  if (session?.user) {
    login.style.display = "none";
    register.style.display = "none";
    if (!status) {
      status = document.createElement("span");
      status.id = "accountStatus";
      status.className = "account-link";
      links.prepend(status);
    }
    status.textContent = session.user.user_metadata?.full_name || session.user.email || "My account";
    if (!logout) {
      logout = document.createElement("button");
      logout.id = "logoutButton";
      logout.className = "account-link";
      logout.type = "button";
      logout.textContent = "LOG OUT";
      logout.addEventListener("click", async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) notify(error.message);
        else notify("You have logged out.");
      });
      links.prepend(logout);
    }
  } else {
    login.style.display = "";
    register.style.display = "";
    status?.remove();
    logout?.remove();
  }
}

// Restore an existing session and keep the header in sync with auth changes.
supabaseClient.auth.getSession().then(({ data, error }) => {
  if (error) console.error("Could not restore Supabase session:", error.message);
  updateAccountUI(data?.session || null);
});
supabaseClient.auth.onAuthStateChange((_event, session) => updateAccountUI(session));

document.getElementById("registerForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const message = document.getElementById("registerMessage");
  const password = data.get("password");
  if (password !== data.get("confirmPassword")) {
    setAuthMessage("registerMessage", "Your passwords do not match.", true);
    return;
  }
  const button = event.currentTarget.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Creating account...";
  setAuthMessage("registerMessage", "Creating your account securely...");
  try {
    const { data: result, error } = await supabaseClient.auth.signUp({
      email: String(data.get("email")).trim(),
      password,
      options: { data: { full_name: String(data.get("name")).trim(), phone: String(data.get("phone")).trim() } }
    });
    if (error) throw error;
    if (result.session) {
      setAuthMessage("registerMessage", "Account created successfully. You are now logged in.");
      form.reset();
    } else {
      setAuthMessage("registerMessage", "Account created. Check your email for a confirmation link before logging in.");
      form.reset();
    }
  } catch (error) {
    setAuthMessage("registerMessage", error.message || "Unable to create your account. Please try again.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Create account";
  }
});

document.getElementById("loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Logging in...";
  setAuthMessage("loginMessage", "Signing you in...");
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: String(data.get("email")).trim(),
      password: data.get("password")
    });
    if (error) throw error;
    setAuthMessage("loginMessage", "Login successful. Welcome back!");
    form.reset();
    history.replaceState(null, "", location.pathname + location.search);
    showAuthPage("");
  } catch (error) {
    setAuthMessage("loginMessage", error.message || "Unable to log in. Please check your details.", true);
  } finally {
    button.disabled = false;
    button.textContent = "Log in";
  }
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
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

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