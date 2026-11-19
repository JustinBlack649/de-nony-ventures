/* ==========================================================
   DE-NONY Ventures — storefront script
   ========================================================== */

/* ---------- Configuration (edit these) ---------- */

// WhatsApp number in international format, digits only (no + or spaces).
// Example for Nigeria: "2348012345678"
const WHATSAPP_NUMBER = "2348000000000";

// Optional social links. Leave "" to keep the icon pointing at the footer.
const SOCIAL_LINKS = {
  instagram: "", // e.g. "https://instagram.com/yourhandle"
  tiktok: ""     // e.g. "https://tiktok.com/@yourhandle"
};

// Supabase project. The publishable key is designed to be used in the browser.
const SUPABASE_URL = "https://feakzaogeaftafasvhne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xoqCFXxKxXf_-CvYeBhLcw_cQdsD3j8";

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

/* ---------- Helpers & state ---------- */

const money = value => "₦" + value.toLocaleString("en-NG");
const CART_KEY = "denony_cart_v1";
const AUTH_PAGES = ["register", "login"];

let cart = [];
let activeCategory = "All";
let currentAuthPage = "";

const grid = document.getElementById("productGrid");
const affGrid = document.getElementById("affProductGrid");
const search = document.getElementById("search");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

const whatsappReady = () =>
  /^\d{8,15}$/.test(WHATSAPP_NUMBER) && WHATSAPP_NUMBER !== "2348000000000";

function openWhatsApp(text) {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener"
  );
}

/* ---------- Page routing (home vs. login / register) ---------- */

function showAuthPage(page) {
  currentAuthPage = page;

  document.getElementById("authHomeLink").classList.toggle("active", Boolean(page));
  document.querySelectorAll(".auth-area").forEach(section => {
    section.classList.toggle("active", section.id === page);
  });
  document.querySelectorAll(".app > section:not(.auth-area), .app > footer")
    .forEach(section => { section.style.display = page ? "none" : ""; });
  document.querySelector(".app > header").style.display = page ? "none" : "";
  document.querySelector(".announcement").style.display = page ? "none" : "";

  if (page) {
    window.scrollTo({ top: 0 });
    return;
  }

  // Back on the storefront: honour an in-page anchor if there is one, else go to the top.
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView();
  else window.scrollTo({ top: 0 });
}

// Only react when we actually move between the storefront and an auth page.
// Ordinary anchors (#shop, #about, #aff, #contact) are left to the browser,
// otherwise they'd be yanked back to the top of the page.
function route() {
  const id = location.hash.slice(1);
  const page = AUTH_PAGES.includes(id) ? id : "";
  if (page !== currentAuthPage) showAuthPage(page);
}

function goHome() {
  history.replaceState(null, "", location.pathname + location.search);
  showAuthPage("");
}

document.getElementById("authHomeLink").addEventListener("click", event => {
  event.preventDefault();
  goHome();
});

document.querySelectorAll("[data-auth]").forEach(control => {
  control.addEventListener("click", event => {
    event.preventDefault();
    const page = control.dataset.auth;
    if (location.hash.slice(1) === page) showAuthPage(page);
    else location.hash = page; // triggers hashchange -> route(), and Back button works
  });
});

window.addEventListener("hashchange", route);

/* ---------- Supabase auth ---------- */

const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

if (!supabaseClient) {
  // Don't crash the whole site if the CDN is blocked/offline: the shop still works.
  console.error("Supabase library did not load. Accounts are unavailable until it does.");
}

function setAuthMessage(id, message, isError = false) {
  const element = document.getElementById(id);
  element.textContent = message;
  element.style.color = isError ? "#b42318" : "#176b43";
}

function friendlyAuthError(error, fallback) {
  const msg = error?.message || "";
  if (/invalid login credentials/i.test(msg)) return "Incorrect email or password.";
  if (/email not confirmed/i.test(msg)) return "Please confirm your email first. Check your inbox for the confirmation link.";
  if (/already registered|already exists/i.test(msg)) return "An account with this email already exists. Please log in instead.";
  if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a few minutes and try again.";
  return msg || fallback;
}

function updateAccountUI(session) {
  const user = session?.user || null;
  document.querySelectorAll(".account-links [data-auth]").forEach(el => { el.hidden = Boolean(user); });

  const status = document.getElementById("accountStatus");
  const logout = document.getElementById("logoutButton");
  status.textContent = user ? (user.user_metadata?.full_name || user.email || "My account") : "";
  status.hidden = !user;
  logout.hidden = !user;
}

document.getElementById("logoutButton").addEventListener("click", async () => {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  notify(error ? error.message : "You have logged out.");
});

if (supabaseClient) {
  // Restore an existing session and keep the header in sync with auth changes.
  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) console.error("Could not restore Supabase session:", error.message);
    updateAccountUI(data?.session || null);
  });
  supabaseClient.auth.onAuthStateChange((_event, session) => updateAccountUI(session));
} else {
  updateAccountUI(null);
}

document.getElementById("registerForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const button = form.querySelector("button[type=submit]");

  if (!supabaseClient) {
    setAuthMessage("registerMessage", "Accounts are temporarily unavailable. Please check your connection and refresh.", true);
    return;
  }
  const password = String(data.get("password"));
  if (password !== data.get("confirmPassword")) {
    setAuthMessage("registerMessage", "Your passwords do not match.", true);
    return;
  }

  button.disabled = true;
  button.textContent = "Creating account...";
  setAuthMessage("registerMessage", "Creating your account securely...");
  try {
    const { data: result, error } = await supabaseClient.auth.signUp({
      email: String(data.get("email")).trim(),
      password,
      options: {
        // Send the confirmation link back to this site (must be allowed in Supabase > Auth > URL Configuration).
        emailRedirectTo: location.origin + location.pathname,
        data: { full_name: String(data.get("name")).trim(), phone: String(data.get("phone")).trim() }
      }
    });
    if (error) throw error;

    // With email confirmation on, Supabase returns a fake user with no identities for an existing email
    // (no error, no email sent). Tell the person instead of leaving them waiting for a message.
    if (result.user && Array.isArray(result.user.identities) && result.user.identities.length === 0) {
      setAuthMessage("registerMessage", "An account with this email already exists. Please log in instead.", true);
      return;
    }

    form.reset();
    if (result.session) {
      setAuthMessage("registerMessage", "Account created successfully. You are now logged in.");
      setTimeout(() => { if (currentAuthPage === "register") goHome(); }, 1200);
    } else {
      setAuthMessage("registerMessage", "Account created. Check your email for a confirmation link before logging in.");
    }
  } catch (error) {
    setAuthMessage("registerMessage", friendlyAuthError(error, "Unable to create your account. Please try again."), true);
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

  if (!supabaseClient) {
    setAuthMessage("loginMessage", "Accounts are temporarily unavailable. Please check your connection and refresh.", true);
    return;
  }

  button.disabled = true;
  button.textContent = "Logging in...";
  setAuthMessage("loginMessage", "Signing you in...");
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: String(data.get("email")).trim(),
      password: String(data.get("password"))
    });
    if (error) throw error;
    form.reset();
    setAuthMessage("loginMessage", "");
    goHome();
    notify("Login successful. Welcome back!");
  } catch (error) {
    setAuthMessage("loginMessage", friendlyAuthError(error, "Unable to log in. Please check your details."), true);
  } finally {
    button.disabled = false;
    button.textContent = "Log in";
  }
});

/* ---------- Product grids ---------- */

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
        <button class="add-button" type="button" data-add="${p.id}">Add to bag +</button>
      </div>
    </article>
  `).join("") : `<div class="empty">No products found. Try another search.</div>`;
}

function renderAffProducts() {
  affGrid.innerHTML = affProducts.map(p => `
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
        <button class="add-button" type="button" data-enquire="${p.id}">Enquire about product ↗</button>
      </div>
    </article>
  `).join("");
}

function enquire(id) {
  const p = affProducts.find(x => x.id === id);
  if (!p) return;
  if (whatsappReady()) {
    openWhatsApp(`Hello DE-NONY Ventures! I'd like to enquire about the ${p.name} from the AFF collection.`);
  } else {
    notify("Contact us for AFF product details and pricing");
  }
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

affGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-enquire]");
  if (button) enquire(Number(button.dataset.enquire));
});

/* ---------- Cart ---------- */

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cart = Array.isArray(saved)
      ? saved.filter(item =>
          item && Number.isInteger(item.qty) && item.qty > 0 &&
          products.some(p => p.id === item.id && p.price > 0))
      : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  renderCart();
  notify("Added to your bag");
}

function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(cartTotal());

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
                <button type="button" data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button type="button" data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button class="remove" type="button" data-remove="${p.id}">Remove</button>
          </div>
        `;
      }).join("")
    : `<div class="cart-empty">Your bag is empty.<br>Add something from the collection.</div>`;

  const checkout = document.getElementById("checkout");
  checkout.disabled = !cart.length;
  checkout.style.opacity = cart.length ? "1" : ".45";

  saveCart();
}

document.getElementById("cartItems").addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  if (qtyButton) {
    changeQty(Number(qtyButton.dataset.id), Number(qtyButton.dataset.qty));
    return;
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    const item = cart.find(x => x.id === Number(remove.dataset.remove));
    if (item) changeQty(item.id, -item.qty);
  }
});

function openCart() {
  cartPanel.inert = false;
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  closeCartButton.focus();
}

function closeCart() {
  const wasOpen = cartPanel.classList.contains("open");
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartPanel.inert = true;
  document.body.classList.remove("no-scroll");
  if (wasOpen) openCartButton.focus();
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeCart();
  document.querySelector(".goods-menu")?.removeAttribute("open");
});

document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) return;

  if (!whatsappReady()) {
    console.warn("Set WHATSAPP_NUMBER in script.js to enable ordering.");
    notify("Online ordering is being set up. Please contact us to place your order.");
    return;
  }

  const lines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `${p.name} x${item.qty} = ${money(p.price * item.qty)}`;
  });

  openWhatsApp(`Hello DE-NONY Ventures! I'd like to place an order:\n${lines.join("\n")}\n\nTotal: ${money(cartTotal())}`);
});

/* ---------- Filters, search & menus ---------- */

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".filter").forEach(x => {
    x.classList.toggle("active", x.dataset.category === category);
  });
  renderProducts();
}

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (button) setCategory(button.dataset.category);
});

document.querySelectorAll("[data-jump-category]").forEach(link => {
  link.addEventListener("click", () => {
    setCategory(link.dataset.jumpCategory);
    document.querySelector(".goods-menu").removeAttribute("open");
  });
});

document.querySelectorAll("[data-category-jump]").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.categoryJump);
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

search.addEventListener("input", renderProducts);

// Close the GOODS dropdown when clicking anywhere else.
document.addEventListener("click", event => {
  const menu = document.querySelector(".goods-menu");
  if (menu && menu.hasAttribute("open") && !menu.contains(event.target)) menu.removeAttribute("open");
});

/* ---------- Social / contact links ---------- */

document.querySelectorAll('[data-social="whatsapp"]').forEach(link => {
  if (!whatsappReady()) return;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  link.target = "_blank";
  link.rel = "noopener";
});
["instagram", "tiktok"].forEach(name => {
  if (!SOCIAL_LINKS[name]) return;
  document.querySelectorAll(`[data-social="${name}"]`).forEach(link => {
    link.href = SOCIAL_LINKS[name];
    link.target = "_blank";
    link.rel = "noopener";
  });
});

/* ---------- Init ---------- */

document.getElementById("year").textContent = new Date().getFullYear();

loadCart();
renderProducts();
renderAffProducts();
renderCart();
route();
