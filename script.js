/* ==========================================================
   DE-NONY Ventures — storefront script
   ========================================================== */

/* ---------- Configuration (edit these) ---------- */

// WhatsApp number in international format, digits only (no + or spaces).
// Example for Nigeria: "2348012345678"
const WHATSAPP_NUMBER = "2348033979409";

// Optional social links. Leave "" to keep the icon pointing at the footer.
const SOCIAL_LINKS = {
  instagram: "", // e.g. "https://instagram.com/yourhandle"
  twitter: "",   // X (Twitter), e.g. "https://x.com/yourhandle"
  tiktok: ""     // e.g. "https://tiktok.com/@yourhandle"
};

// Supabase project. The publishable key is designed to be used in the browser.
const SUPABASE_URL = "https://feakzaogeaftafasvhne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xoqCFXxKxXf_-CvYeBhLcw_cQdsD3j8";

/* ---------- Products ----------
   EDIT THIS LIST to match your real stock. Prices are in Nigerian naira.

   slug         Used in the product link:  yoursite.com/#product/<slug>
   description  Array of paragraphs shown in the product popup.
   highlights   Short bullet points shown under the description.
   images       The shop products use shots("slug", "Name"), which loads images/<slug>-1.svg to -4.svg
                (clean placeholder artwork). To use your own photos, either overwrite those files
                (keep the file names), or list your own, e.g.
                ["images/everyday-shirt-1.jpg", "images/everyday-shirt-2.jpg"]
                or [{ src: "images/x.jpg", alt: "Front view" }]. Square photos (1:1) look best.
   variants     Required choices the shopper must make before "Add to bag" unlocks.
                { label: "Size", noun: "size", options: ["S", "M", "L"] }
                Leave [] for products with nothing to choose.
*/
const SHOT_LABELS = ["front view", "close-up", "angled view", "styled detail"];
const shots = (slug, name) =>
  SHOT_LABELS.map((label, i) => ({ src: `images/${slug}-${i + 1}.svg`, alt: `${name} - ${label}` }));

const products = [
  {
    id: 1, slug: "everyday-shirt", name: "Everyday Shirt", category: "Clothes", price: 12500,
    tag: "Clothing", bg: "#e8d9c8",
    description: [
      "A relaxed, easy-to-style shirt made for daily wear. Clean lines and a comfortable fit make it simple to dress up with trousers or keep casual with your favourite jeans.",
      "Choose your size below and add it to your bag. Not sure which size to pick? Message us and we'll help you decide."
    ],
    highlights: ["Comfortable everyday fit", "Easy to pair with trousers or jeans", "Available in S, M, L and XL"],
    images: shots("everyday-shirt", "Everyday Shirt"),
    variants: [{ label: "Size", noun: "size", options: ["S", "M", "L", "XL"] }]
  },
  {
    id: 2, slug: "classic-sneakers", name: "Classic Sneakers", category: "Clothes", price: 28000,
    tag: "Popular", bg: "#d9e0d8",
    description: [
      "Classic low-profile sneakers that go with almost everything in your wardrobe. A timeless look that works for errands, work-from-anywhere days and weekends out.",
      "Sizes are in EU sizing. Pick your size below to add them to your bag."
    ],
    highlights: ["Versatile, classic styling", "Comfortable for all-day wear", "EU sizes 40 to 45"],
    images: shots("classic-sneakers", "Classic Sneakers"),
    variants: [{ label: "Shoe size (EU)", noun: "shoe size", options: ["40", "41", "42", "43", "44", "45"] }]
  },
  {
    id: 3, slug: "the-daily-shades", name: "The Daily Shades", category: "Accessories", price: 15000,
    tag: "", bg: "#e5d9d3",
    description: [
      "Everyday sunglasses to keep the glare down and the style up. A simple, flattering shape that works with casual and smart outfits alike.",
      "A good grab-and-go accessory for the commute, the beach or a sunny weekend."
    ],
    highlights: ["Simple, flattering frame shape", "Suits casual and smart outfits"],
    images: shots("the-daily-shades", "The Daily Shades"), variants: []
  },
  {
    id: 4, slug: "everyday-handbag", name: "Everyday Handbag", category: "Accessories", price: 18500,
    tag: "Bestseller", bg: "#e6dfc9",
    description: [
      "A practical handbag with room for your daily essentials. Easy to carry, easy to match, and neat enough to take from the office to dinner.",
      "One of our bestsellers for a reason: it simply works with everything."
    ],
    highlights: ["Room for daily essentials", "Easy to match with any outfit", "Bestseller"],
    images: shots("everyday-handbag", "Everyday Handbag"), variants: []
  },
  {
    id: 5, slug: "body-lotion", name: "Body Lotion", category: "Cosmetics", price: 8500,
    tag: "", bg: "#e8d8c6",
    description: [
      "A smooth everyday body lotion for a soft, moisturised feel after bathing. Easy to apply and a pleasant part of your daily routine.",
      "Pair it with the Beauty Set for a complete self-care bundle."
    ],
    highlights: ["Smooth, easy application", "Made for daily use"],
    images: shots("body-lotion", "Body Lotion"), variants: []
  },
  {
    id: 6, slug: "beauty-set", name: "Beauty Set", category: "Cosmetics", price: 14500,
    tag: "New", bg: "#d9d6e2",
    description: [
      "A thoughtfully put-together beauty set for your daily self-care routine. Great as a treat for yourself or as a gift for someone special.",
      "Contact us if you'd like it gift-wrapped or have questions about what's inside."
    ],
    highlights: ["Complete self-care routine", "A great gift idea", "New arrival"],
    images: shots("beauty-set", "Beauty Set"), variants: []
  },
  {
    id: 7, slug: "electric-kettle", name: "Electric Kettle", category: "Appliances", price: 22000,
    tag: "Home", bg: "#e9dfc7",
    description: [
      "A convenient electric kettle for quick hot water at home or in the office. Ideal for tea, coffee, noodles and more, with no waiting around.",
      "A practical kitchen upgrade that makes busy mornings easier."
    ],
    highlights: ["Quick, convenient hot water", "Ideal for home or office"],
    images: shots("electric-kettle", "Electric Kettle"), variants: []
  },
  {
    id: 8, slug: "table-fan", name: "Table Fan", category: "Appliances", price: 35000,
    tag: "", bg: "#d5e1df",
    description: [
      "A table fan to keep your room fresh and comfortable through the warm days and nights. Compact enough for a desk, bedside or shop counter.",
      "A simple way to stay cool wherever you work and rest."
    ],
    highlights: ["Compact tabletop size", "Keeps rooms fresh and comfortable"],
    images: shots("table-fan", "Table Fan"), variants: []
  }
];

const affProducts = [
  {
    id: 101, slug: "aff-branded-rice", name: "AFF Branded Rice", category: "AFF Collection", price: 0,
    pack: "pack-rice", label: "AFF PREMIUM RICE", detail: "LONG GRAIN · QUALITY", tag: "Customized", bg: "#e8d9c8",
    description: [
      "Premium long-grain rice presented under the AFF, Atmosphere For Favour, identity. A quality everyday staple with a favourable experience from pantry to plate.",
      "Packaging shown is a concept. Contact us for availability, pack sizes and pricing."
    ],
    highlights: ["Long-grain, quality rice", "Customized AFF branding"], images: [], variants: []
  },
  {
    id: 102, slug: "aff-perfume", name: "AFF Perfume", category: "AFF Collection", price: 0,
    pack: "pack-perfume", label: "AFF", detail: "EAU DE PARFUM", tag: "Customized", bg: "#e5d9d3",
    description: [
      "An AFF eau de parfum presented in elegant, customized packaging. A thoughtful gift or a signature scent of your own.",
      "Packaging shown is a concept. Contact us for availability and pricing."
    ],
    highlights: ["Eau de parfum", "Customized AFF branding"], images: [], variants: []
  },
  {
    id: 103, slug: "aff-body-wash", name: "AFF Body Wash", category: "AFF Collection", price: 0,
    pack: "pack-bodywash", label: "AFF BODY WASH", detail: "GENTLE CARE", tag: "Customized", bg: "#d9e0d8",
    description: [
      "A gentle AFF body wash for a fresh, comfortable daily clean, presented with the AFF identity.",
      "Packaging shown is a concept. Contact us for availability and pricing."
    ],
    highlights: ["Gentle daily care", "Customized AFF branding"], images: [], variants: []
  },
  {
    id: 104, slug: "aff-wines", name: "AFF Wines", category: "AFF Collection", price: 0,
    pack: "pack-wine", label: "AFF WINE", detail: "RESERVE COLLECTION", tag: "Customized", bg: "#e6dfc9",
    description: [
      "The AFF reserve collection of wines, presented in customized AFF packaging. Ideal for gifting, celebrations and special occasions.",
      "Packaging shown is a concept. Contact us for availability and pricing."
    ],
    highlights: ["Reserve collection", "Great for gifting and events"], images: [], variants: []
  },
  {
    id: 105, slug: "aff-bottled-water", name: "AFF Bottled Water", category: "AFF Collection", price: 0,
    pack: "pack-water", label: "AFF", detail: "PURE WATER", tag: "Customized", bg: "#d5e1df",
    description: [
      "Pure bottled water with custom AFF branding. A neat choice for events, offices, hospitality and everyday refreshment.",
      "Packaging shown is a concept. Contact us for availability, order quantities and pricing."
    ],
    highlights: ["Pure bottled water", "Branded for events and offices"], images: [], variants: []
  }
];

products.push(...affProducts);

/* ---------- Helpers & state ---------- */

const money = value => "₦" + value.toLocaleString("en-NG");
const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Inline SVG icons from the sprite at the top of index.html (Lucide + Simple Icons).
const icon = (name, cls = "") =>
  `<svg class="icon${cls ? " " + cls : ""}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
const CATEGORY_ICONS = { Clothes: "shirt", Accessories: "handbag", Cosmetics: "sparkles", Appliances: "plug-zap", "AFF Collection": "leaf" };
const categoryIcon = category => icon(CATEGORY_ICONS[category] || "package");
const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const CART_KEY = "denony_cart_v2";
const AUTH_PAGES = ["register", "login"];

// Normalise product data so missing fields never break rendering.
products.forEach(p => {
  p.slug = p.slug || slugify(p.name);
  p.description = p.description || [];
  p.highlights = p.highlights || [];
  p.variants = p.variants || [];
  p.images = (p.images || []).map((img, i) =>
    typeof img === "string" ? { src: img, alt: `${p.name} - image ${i + 1}` } : { alt: `${p.name} - image ${i + 1}`, ...img });
});

const findBySlug = slug => products.find(p => p.slug === slug);
const isAff = p => p.category === "AFF Collection";
const variantNoun = v => v.noun || v.label.toLowerCase();

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
const pdModal = document.getElementById("productModal");
const pdBody = document.getElementById("pdBody");
const pdClose = document.getElementById("pdClose");

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

/* ---------- Page routing (home / login / register / product popup) ---------- */

function safeHash() {
  try { return decodeURIComponent(location.hash.slice(1)); } catch { return location.hash.slice(1); }
}

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
  const id = safeHash();
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView();
  else window.scrollTo({ top: 0 });
}

// Only react when we actually move between the storefront, an auth page or a product popup.
// Ordinary anchors (#shop, #about, #aff, #contact) are left to the browser.
function route(fromNav = false) {
  const id = safeHash();
  const productMatch = /^product\/([a-z0-9-]+)$/i.exec(id);
  const page = AUTH_PAGES.includes(id) ? id : "";

  if (page !== currentAuthPage) showAuthPage(page);

  if (productMatch) {
    const product = findBySlug(productMatch[1].toLowerCase());
    if (product) {
      if (!pdState) pdOpenedByNav = fromNav; // true when opened by a click, so Close can use Back
      openProductModal(product);
    } else {
      history.replaceState(null, "", location.pathname + location.search); // unknown product link
    }
  } else if (pdState) {
    closeProductUI();
  }
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

window.addEventListener("hashchange", () => route(true));

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
  document.getElementById("accountName").textContent = user ? (user.user_metadata?.full_name || user.email || "My account") : "";
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

function cardMedia(p) {
  const first = p.images[0];
  if (first?.src) {
    return `<img class="aspect-square object-cover" src="${esc(first.src)}" alt="${esc(first.alt)}" width="1200" height="1200" loading="lazy" decoding="async">`;
  }
  if (p.pack) {
    return `<div class="aff-pack ${p.pack}" role="img" aria-label="AFF ${esc(p.name)} packaging concept">
      <div class="aff-pack-label">${p.label}<small>${p.detail}</small></div></div>`;
  }
  return `<span class="product-fallback" aria-hidden="true">${icon("package")}</span>`;
}

// Square frame for photos; the AFF packaging concepts keep their taller frame.
const visualClass = p => "product-visual" + (p.images[0]?.src ? " aspect-square" : "");

function renderProducts() {
  const term = search.value.trim().toLowerCase();

  const visible = products.filter(p =>
    !isAff(p) &&
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
  );

  grid.innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <a class="product-link" href="#product/${p.slug}" tabindex="-1" aria-hidden="true">
        <div class="${visualClass(p)}" style="--product-bg:${p.bg}">
          ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
          ${cardMedia(p)}
        </div>
      </a>
      <div class="product-info">
        <div class="product-meta">
          <a class="product-link product-name" href="#product/${p.slug}">${p.name}</a>
          <span class="product-price">${money(p.price)}</span>
        </div>
        <div class="product-category">${categoryIcon(p.category)}${p.category}</div>
        ${p.variants.length
          ? `<button class="add-button" type="button" data-open="${p.slug}">Select ${p.variants.map(variantNoun).join(" & ")}</button>`
          : `<button class="add-button" type="button" data-add="${p.id}">Add to bag ${icon("plus")}</button>`}
      </div>
    </article>
  `).join("") : `<div class="empty">No products found. Try another search.</div>`;
}

function renderAffProducts() {
  affGrid.innerHTML = affProducts.map(p => `
    <article class="product-card">
      <a class="product-link" href="#product/${p.slug}" tabindex="-1" aria-hidden="true">
        <div class="${visualClass(p)}" style="--product-bg:${p.bg}">
          <span class="tag">${p.tag}</span>
          ${cardMedia(p)}
        </div>
      </a>
      <div class="product-info">
        <div class="product-meta">
          <a class="product-link product-name" href="#product/${p.slug}">${p.name}</a>
          <span class="product-price">Enquire</span>
        </div>
        <div class="product-category">${categoryIcon(p.category)}${p.category} · Packaging concept</div>
        <button class="add-button" type="button" data-enquire="${p.id}">Enquire about product ${icon("arrow-up-right")}</button>
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
  const add = event.target.closest("[data-add]");
  if (add) { addToCart(Number(add.dataset.add)); return; }
  const open = event.target.closest("[data-open]");
  if (open) location.hash = "product/" + open.dataset.open;
});

affGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-enquire]");
  if (button) enquire(Number(button.dataset.enquire));
});

/* ---------- Product detail popup ---------- */

const PLACEHOLDER_VIEWS = [
  { label: "Front view", s: 1,    r: 0,   bx: "30%", by: "25%" },
  { label: "Close-up",   s: 1.55, r: -8,  bx: "70%", by: "30%" },
  { label: "Side angle", s: .85,  r: 14,  bx: "25%", by: "70%" },
  { label: "Detail",     s: 1.3,  r: 6,   bx: "65%", by: "65%" }
];

let pdState = null;       // { product, gallery, index, selected, qty }
let pdOpener = null;      // element to return focus to on close
let pdOpenedByNav = false;

function galleryFor(p) {
  return p.images.length
    ? p.images.map((img, i) => ({ src: img.src, alt: img.alt, label: `Image ${i + 1}` }))
    : PLACEHOLDER_VIEWS.map(v => ({ view: v, label: v.label, alt: `${p.name} - ${v.label}` }));
}

function mediaMarkup(p, item) {
  if (item.src) return `<img class="pd-img" src="${esc(item.src)}" alt="${esc(item.alt)}">`;
  const v = item.view;
  const figure = p.pack
    ? `<div class="aff-pack ${p.pack}"><div class="aff-pack-label">${p.label}<small>${p.detail}</small></div></div>`
    : `<span class="pd-fallback">${icon("package")}</span>`;
  return `<div class="pd-placeholder" role="img" aria-label="${esc(item.alt)}"
      style="--s:${v.s};--r:${v.r}deg;--bx:${v.bx};--by:${v.by}"><div class="pd-figure">${figure}</div></div>`;
}

function renderProductModal(p) {
  const gallery = galleryFor(p);
  pdState = { product: p, gallery, index: 0, selected: {}, qty: 1 };

  const thumbs = gallery.map((item, i) => `
    <button class="pd-thumb" type="button" data-thumb="${i}" aria-label="Show ${esc(item.label)}"
      aria-current="${i === 0}" style="--product-bg:${p.bg}">
      ${item.src ? `<img src="${esc(item.src)}" alt="" loading="lazy">` : `<span aria-hidden="true">${mediaMarkup(p, item)}</span>`}
    </button>`).join("");

  const variants = p.variants.map((v, gi) => `
    <fieldset class="pd-variant">
      <legend>${esc(v.label)} <span class="pd-req">Required</span><span class="pd-chosen" id="pdChosen${gi}"></span></legend>
      <div class="pd-options">
        ${v.options.map(o => `
          <label class="pd-option">
            <input type="radio" name="variant-${gi}" value="${esc(o)}" data-group="${gi}">
            <span>${esc(o)}</span>
          </label>`).join("")}
      </div>
    </fieldset>`).join("");

  const actions = isAff(p)
    ? `<button class="pd-add" type="button" data-pd-enquire>Enquire about this product ${icon("arrow-up-right")}</button>`
    : `<div class="pd-buy">
         <div class="pd-qty" role="group" aria-label="Quantity">
           <button type="button" data-pd-qty="-1" aria-label="Decrease quantity">${icon("minus")}</button>
           <span id="pdQty" aria-live="polite">1</span>
           <button type="button" data-pd-qty="1" aria-label="Increase quantity">${icon("plus")}</button>
         </div>
         <button class="pd-add" type="button" id="pdAdd" data-pd-add></button>
       </div>
       <p class="pd-hint" id="pdHint" role="status"></p>`;

  pdBody.innerHTML = `
    <div class="pd-gallery">
      <div class="pd-stage" style="--product-bg:${p.bg}">
        <div class="pd-media" id="pdMedia">${mediaMarkup(p, gallery[0])}</div>
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <button class="pd-nav pd-prev" type="button" data-slide="-1" aria-label="Previous image">${icon("chevron-left")}</button>
        <button class="pd-nav pd-next" type="button" data-slide="1" aria-label="Next image">${icon("chevron-right")}</button>
        <span class="pd-count" id="pdCount" aria-live="polite">1 / ${gallery.length}</span>
      </div>
      <div class="pd-thumbs" role="group" aria-label="Product images">${thumbs}</div>
    </div>
    <div class="pd-info">
      <div class="eyebrow">${categoryIcon(p.category)}${esc(p.category)}</div>
      <h2 id="pdTitle">${esc(p.name)}</h2>
      <div class="pd-price">${isAff(p) ? "Enquire for pricing" : money(p.price)}</div>
      <div class="pd-desc">${p.description.map(t => `<p>${esc(t)}</p>`).join("")}</div>
      ${p.highlights.length ? `<ul class="pd-points">${p.highlights.map(h => `<li>${icon("check")}<span>${esc(h)}</span></li>`).join("")}</ul>` : ""}
      ${variants}
      ${actions}
    </div>`;

  updateBuyState();
}

function setSlide(index) {
  if (!pdState) return;
  const { product, gallery } = pdState;
  pdState.index = (index + gallery.length) % gallery.length;
  document.getElementById("pdMedia").innerHTML = mediaMarkup(product, gallery[pdState.index]);
  document.getElementById("pdCount").textContent = `${pdState.index + 1} / ${gallery.length}`;
  pdBody.querySelectorAll("[data-thumb]").forEach((thumb, i) => {
    thumb.setAttribute("aria-current", String(i === pdState.index));
  });
}

// Add to Bag stays disabled until every required option has been chosen.
function updateBuyState() {
  const add = document.getElementById("pdAdd");
  if (!add || !pdState) return;
  const { product, selected, qty } = pdState;
  const missing = product.variants.filter(v => !selected[v.label]);
  const hint = document.getElementById("pdHint");

  add.disabled = missing.length > 0;
  if (missing.length === 0) {
    add.textContent = `Add to bag · ${money(product.price * qty)}`;
    hint.textContent = "";
  } else {
    add.textContent = missing.length === 1 ? `Select a ${variantNoun(missing[0])}` : "Select your options";
    hint.textContent = `Please choose your ${missing.map(variantNoun).join(" and ")} to add this item to your bag.`;
  }
  document.getElementById("pdQty").textContent = qty;
}

function openProductModal(p) {
  if (pdState?.product === p) return;
  const alreadyOpen = Boolean(pdState);
  if (!alreadyOpen) pdOpener = document.activeElement;
  renderProductModal(p);
  pdModal.hidden = false;
  document.body.classList.add("no-scroll");
  pdModal.querySelector(".pd-dialog").scrollTop = 0;
  pdClose.focus();
  document.title = `${p.name} | DE-NONY Ventures`;
}

function closeProductUI() {
  if (!pdState) return;
  pdState = null;
  pdModal.hidden = true;
  pdBody.innerHTML = "";
  document.body.classList.remove("no-scroll");
  document.title = "DE-NONY Ventures | Shop Smart. Live Better.";
  if (pdOpener && document.contains(pdOpener)) pdOpener.focus();
  pdOpener = null;
}

function closeProduct() {
  if (!pdState) return;
  closeProductUI();
  if (location.hash.startsWith("#product/")) {
    if (pdOpenedByNav) history.back();
    else history.replaceState(null, "", location.pathname + location.search);
  }
}

pdClose.addEventListener("click", closeProduct);
pdModal.addEventListener("click", event => { if (event.target === pdModal) closeProduct(); });

pdBody.addEventListener("click", event => {
  if (!pdState) return;
  const slide = event.target.closest("[data-slide]");
  if (slide) { setSlide(pdState.index + Number(slide.dataset.slide)); return; }
  const thumb = event.target.closest("[data-thumb]");
  if (thumb) { setSlide(Number(thumb.dataset.thumb)); return; }
  const step = event.target.closest("[data-pd-qty]");
  if (step) {
    pdState.qty = Math.min(10, Math.max(1, pdState.qty + Number(step.dataset.pdQty)));
    updateBuyState();
    return;
  }
  if (event.target.closest("[data-pd-add]")) {
    addToCart(pdState.product.id, pdState.selected, pdState.qty);
    return;
  }
  if (event.target.closest("[data-pd-enquire]")) enquire(pdState.product.id);
});

pdBody.addEventListener("change", event => {
  const input = event.target.closest("input[data-group]");
  if (!input || !pdState) return;
  const variant = pdState.product.variants[Number(input.dataset.group)];
  pdState.selected[variant.label] = input.value;
  document.getElementById("pdChosen" + input.dataset.group).textContent = ": " + input.value;
  updateBuyState();
});

// Swipe the main image on touch screens.
let touchStartX = null;
pdBody.addEventListener("touchstart", event => {
  touchStartX = event.target.closest(".pd-stage") ? event.touches[0].clientX : null;
}, { passive: true });
pdBody.addEventListener("touchend", event => {
  if (touchStartX === null || !pdState) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(dx) > 40) setSlide(pdState.index + (dx < 0 ? 1 : -1));
});

// Keep keyboard focus inside the popup, and let arrow keys flip through the images.
pdModal.addEventListener("keydown", event => {
  if (event.key === "Tab") {
    const focusable = [...pdModal.querySelectorAll("button:not([disabled]), input:not([disabled]), a[href]")]
      .filter(el => el.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    return;
  }
  if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && event.target.closest(".pd-gallery") && pdState) {
    event.preventDefault();
    setSlide(pdState.index + (event.key === "ArrowRight" ? 1 : -1));
  }
});

/* ---------- Cart ---------- */

// One row per product + chosen options, so a Medium and an XL shirt are separate lines.
function cartKey(p, variants) {
  return [p.id, ...p.variants.map(v => `${v.label}:${variants[v.label]}`)].join("|");
}

function variantsAreValid(p, variants) {
  return p.variants.every(v => v.options.includes(variants?.[v.label]));
}

function variantText(p, item) {
  return p.variants.map(v => `${v.label}: ${item.variants[v.label]}`).join(" · ");
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cart = [];
    if (!Array.isArray(saved)) return;
    saved.forEach(item => {
      const p = products.find(x => x.id === item?.id);
      if (!p || p.price <= 0 || !Number.isInteger(item.qty) || item.qty < 1) return;
      if (!variantsAreValid(p, item.variants)) return;
      const variants = Object.fromEntries(p.variants.map(v => [v.label, item.variants[v.label]]));
      cart.push({ key: cartKey(p, variants), id: p.id, qty: Math.min(item.qty, 99), variants });
    });
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

function addToCart(id, selected = {}, qty = 1) {
  const p = products.find(x => x.id === id);
  if (!p || p.price <= 0) return false;

  // Required options must be chosen: this guards every entry point, not just the popup button.
  const missing = p.variants.find(v => !v.options.includes(selected[v.label]));
  if (missing) {
    notify(`Please choose a ${variantNoun(missing)} first`);
    return false;
  }

  const variants = Object.fromEntries(p.variants.map(v => [v.label, selected[v.label]]));
  const key = cartKey(p, variants);
  const item = cart.find(x => x.key === key);
  if (item) item.qty = Math.min(99, item.qty + qty);
  else cart.push({ key, id, qty, variants });

  renderCart();
  notify("Added to your bag");
  return true;
}

function changeQty(key, amount) {
  const item = cart.find(x => x.key === key);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(x => x.key !== key);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(cartTotal());

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(item => {
        const p = products.find(x => x.id === item.id);
        const thumb = p.images[0]?.src
          ? `<img src="${esc(p.images[0].src)}" alt="" loading="lazy">`
          : icon("package");
        return `
          <div class="cart-row">
            <div class="cart-thumb">${thumb}</div>
            <div>
              <strong>${p.name}</strong>
              ${p.variants.length ? `<small class="cart-variant">${esc(variantText(p, item))}</small>` : ""}
              <small>${money(p.price)}</small>
              <div class="qty">
                <button type="button" data-qty="-1" data-key="${esc(item.key)}" aria-label="Decrease quantity">${icon("minus")}</button>
                <span>${item.qty}</span>
                <button type="button" data-qty="1" data-key="${esc(item.key)}" aria-label="Increase quantity">${icon("plus")}</button>
              </div>
            </div>
            <button class="remove" type="button" data-remove="${esc(item.key)}">Remove</button>
          </div>
        `;
      }).join("")
    : `<div class="cart-empty">${icon("shopping-bag")}Your bag is empty.<br>Add something from the collection.</div>`;

  const checkout = document.getElementById("checkout");
  checkout.disabled = !cart.length;
  checkout.style.opacity = cart.length ? "1" : ".45";

  saveCart();
}

document.getElementById("cartItems").addEventListener("click", event => {
  const qtyButton = event.target.closest("[data-qty]");
  if (qtyButton) {
    changeQty(qtyButton.dataset.key, Number(qtyButton.dataset.qty));
    return;
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    const item = cart.find(x => x.key === remove.dataset.remove);
    if (item) changeQty(item.key, -item.qty);
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
  if (!pdState) document.body.classList.remove("no-scroll");
  if (wasOpen) openCartButton.focus();
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (pdState) { closeProduct(); return; }
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
    const options = p.variants.length ? ` (${variantText(p, item)})` : "";
    return `${p.name}${options} x${item.qty} = ${money(p.price * item.qty)}`;
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
["instagram", "twitter", "tiktok"].forEach(name => {
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
