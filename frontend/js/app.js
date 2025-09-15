// 全域變數
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let memberInfo = JSON.parse(localStorage.getItem("memberInfo")) || {};
let currentCategory = "all";
let currentPage = 1;
const itemsPerPage = 12;

// 初始化
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  loadProducts();
  updateCartCount();
  checkMemberInfo();
  startBannerSlider();
  updateExchangeRate();
});

// 應用程式初始化
function initializeApp() {
  // 設定事件監聽器
  setupEventListeners();

  // 檢查是否有儲存的會員資訊
  if (memberInfo.memberCode) {
    console.log("會員編號：", memberInfo.memberCode);
  }

  // 載入購物車
  updateCartDisplay();
}

// 設定事件監聽器
function setupEventListeners() {
  // 分類切換
  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", function () {
      document
        .querySelectorAll(".category-item")
        .forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      currentCategory = this.dataset.category;
      currentPage = 1;
      loadProducts();
    });
  });

  // 搜尋功能
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        searchProducts(this.value);
      }
    });
  }

  // 點擊背景關閉彈窗
  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });
}

// 商品資料（模擬資料，實際應從後端獲取）
const productsData = [
  {
    id: 1,
    title: "日本 SK-II 神仙水精華液 230ml",
    price: 4850,
    originalPrice: 5800,
    image: "https://via.placeholder.com/300x300/FFE5E5/FF6B6B?text=SK-II",
    category: "beauty",
    sold: 2341,
    rating: 4.8,
    source: "日本",
    badge: "熱銷",
  },
  {
    id: 2,
    title: "Nike Air Jordan 1 Retro High OG",
    price: 5200,
    originalPrice: 6500,
    image: "https://via.placeholder.com/300x300/E5F5FF/4DABF7?text=AJ1",
    category: "clothing",
    sold: 1523,
    rating: 4.9,
    source: "美國",
    badge: "限量",
  },
  {
    id: 3,
    title: "Apple AirPods Pro 2 藍牙耳機",
    price: 6990,
    originalPrice: 7990,
    image: "https://via.placeholder.com/300x300/F0F0F0/666666?text=AirPods",
    category: "electronics",
    sold: 3421,
    rating: 4.7,
    source: "美國",
  },
  {
    id: 4,
    title: "MUJI 無印良品 超音波香薰機",
    price: 1580,
    originalPrice: 1980,
    image: "https://via.placeholder.com/300x300/FFF5E5/FFB84D?text=MUJI",
    category: "home",
    sold: 892,
    rating: 4.6,
    source: "日本",
  },
  {
    id: 5,
    title: "韓國 GENTLE MONSTER 墨鏡",
    price: 8900,
    originalPrice: 10500,
    image: "https://via.placeholder.com/300x300/E5E5E5/333333?text=GM",
    category: "clothing",
    sold: 445,
    rating: 4.8,
    source: "韓國",
    badge: "新品",
  },
  {
    id: 6,
    title: "日本北海道白色戀人餅乾 36枚入",
    price: 450,
    originalPrice: 580,
    image: "https://via.placeholder.com/300x300/FFF0F5/FF69B4?text=白色戀人",
    category: "food",
    sold: 5231,
    rating: 4.9,
    source: "日本",
  },
  {
    id: 7,
    title: "Dyson V15 Detect 無線吸塵器",
    price: 18900,
    originalPrice: 22900,
    image: "https://via.placeholder.com/300x300/E5F0FF/6366F1?text=Dyson",
    category: "home",
    sold: 234,
    rating: 4.8,
    source: "英國",
    badge: "優惠",
  },
  {
    id: 8,
    title: "Lululemon Align 高腰瑜珈褲",
    price: 3280,
    originalPrice: 3980,
    image: "https://via.placeholder.com/300x300/FFE5F5/EC4899?text=Lululemon",
    category: "clothing",
    sold: 1823,
    rating: 4.7,
    source: "加拿大",
  },
];

// 載入商品
function loadProducts() {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;

  // 篩選商品
  let filteredProducts = productsData;
  if (currentCategory !== "all") {
    filteredProducts = productsData.filter(
      (p) => p.category === currentCategory
    );
  }

  // 分頁處理
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayProducts = filteredProducts.slice(startIndex, endIndex);

  // 渲染商品
  productsGrid.innerHTML = displayProducts
    .map(
      (product) => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${
                  product.badge
                    ? `<span class="product-badge">${product.badge}</span>`
                    : ""
                }
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">
                    <span class="price-current">NT$ ${product.price.toLocaleString()}</span>
                    ${
                      product.originalPrice
                        ? `<span class="price-original">NT$ ${product.originalPrice.toLocaleString()}</span>`
                        : ""
                    }
                </div>
                <div class="product-meta">
                    <span class="product-sold">已售 ${product.sold}</span>
                    <span class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </span>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // 顯示載入更多按鈕
  const hasMore = filteredProducts.length > endIndex;
  document.querySelector(".load-more-btn").style.display = hasMore
    ? "block"
    : "none";
}

// 載入更多商品
function loadMoreProducts() {
  currentPage++;
  const productsGrid = document.getElementById("productsGrid");
  const tempDiv = document.createElement("div");

  // 篩選商品
  let filteredProducts = productsData;
  if (currentCategory !== "all") {
    filteredProducts = productsData.filter(
      (p) => p.category === currentCategory
    );
  }

  // 分頁處理
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayProducts = filteredProducts.slice(startIndex, endIndex);

  // 添加新商品
  tempDiv.innerHTML = displayProducts
    .map(
      (product) => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${
                  product.badge
                    ? `<span class="product-badge">${product.badge}</span>`
                    : ""
                }
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">
                    <span class="price-current">NT$ ${product.price.toLocaleString()}</span>
                    ${
                      product.originalPrice
                        ? `<span class="price-original">NT$ ${product.originalPrice.toLocaleString()}</span>`
                        : ""
                    }
                </div>
                <div class="product-meta">
                    <span class="product-sold">已售 ${product.sold}</span>
                    <span class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </span>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  // 添加到網格
  while (tempDiv.firstChild) {
    productsGrid.appendChild(tempDiv.firstChild);
  }

  // 檢查是否還有更多
  const hasMore = filteredProducts.length > endIndex;
  document.querySelector(".load-more-btn").style.display = hasMore
    ? "block"
    : "none";
}

// 查看商品詳情
function viewProduct(productId) {
  // 儲存商品ID並跳轉到詳情頁
  localStorage.setItem("currentProductId", productId);
  window.location.href = "product-detail.html";
}

// 搜尋商品
function searchProducts(keyword) {
  if (!keyword.trim()) {
    loadProducts();
    return;
  }

  const productsGrid = document.getElementById("productsGrid");
  const filtered = productsData.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.source.toLowerCase().includes(keyword.toLowerCase())
  );

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <p>沒有找到相關商品</p>
            </div>
        `;
  } else {
    productsGrid.innerHTML = filtered
      .map(
        (product) => `
            <div class="product-card" onclick="viewProduct(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    ${
                      product.badge
                        ? `<span class="product-badge">${product.badge}</span>`
                        : ""
                    }
                </div>
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-price">
                        <span class="price-current">NT$ ${product.price.toLocaleString()}</span>
                        ${
                          product.originalPrice
                            ? `<span class="price-original">NT$ ${product.originalPrice.toLocaleString()}</span>`
                            : ""
                        }
                    </div>
                    <div class="product-meta">
                        <span class="product-sold">已售 ${product.sold}</span>
                        <span class="product-rating">
                            <i class="fas fa-star"></i> ${product.rating}
                        </span>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }
}

// 加入購物車
function addToCart(productId, quantity = 1) {
  const product = productsData.find((p) => p.id === productId);
  if (!product) return;

  // 檢查購物車中是否已有此商品
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity,
    });
  }

  // 儲存到 localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // 更新購物車數量
  updateCartCount();

  // 顯示成功提示
  showToast("商品已加入購物車！");
}

// 更新購物車數量
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "block" : "none";
  }
}

// 更新購物車顯示
function updateCartDisplay() {
  // 這個函數在購物車頁面使用
  if (window.location.pathname.includes("cart.html")) {
    renderCart();
  }
}

// 會員資訊相關功能
function showMemberInfo() {
  const modal = document.getElementById("memberModal");
  if (modal) {
    modal.style.display = "block";

    // 如果有儲存的資訊，填入表單
    if (memberInfo.memberCode) {
      document.getElementById("memberCode").value = memberInfo.memberCode;
    }
    if (memberInfo.receiverName) {
      document.getElementById("receiverName").value = memberInfo.receiverName;
    }
  }
}

function closeMemberModal() {
  const modal = document.getElementById("memberModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function saveMemberInfo() {
  const memberCode = document.getElementById("memberCode").value;
  const receiverName = document.getElementById("receiverName").value;

  // 驗證會員編號格式
  const codePattern = /^935-170-\d+$/;
  if (!codePattern.test(memberCode)) {
    alert("請輸入正確的會員編號格式：935-170-XXXXX");
    return;
  }

  if (!receiverName.trim()) {
    alert("請輸入收件人姓名");
    return;
  }

  // 儲存會員資訊
  memberInfo = {
    memberCode: memberCode,
    receiverName: receiverName,
  };

  localStorage.setItem("memberInfo", JSON.stringify(memberInfo));

  closeMemberModal();
  showToast("會員資訊已儲存！");
}

function checkMemberInfo() {
  // 檢查是否有會員資訊，如果沒有則提示設定
  if (!memberInfo.memberCode && !sessionStorage.getItem("memberPromptShown")) {
    setTimeout(() => {
      if (confirm("您還沒有設定會員編號，是否現在設定？")) {
        showMemberInfo();
      }
      sessionStorage.setItem("memberPromptShown", "true");
    }, 3000);
  }
}

// 倉庫資訊相關功能
function showWarehouseInfo() {
  const modal = document.getElementById("warehouseModal");
  if (modal) {
    modal.style.display = "block";
  }
}

function closeWarehouseModal() {
  const modal = document.getElementById("warehouseModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function switchWarehouse(warehouse) {
  // 更新標籤樣式
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // 倉庫資訊
  const warehouseData = {
    xiamen: {
      name: "廈門漳州倉（海快）",
      address:
        "中國-福建省-漳州市-龍海區 東園鎮倉里路普洛斯物流園A02庫1樓一分區1號門",
      phone: "13682536948",
      features: ["免費面單模糊", "隱藏機制導入", "海運快遞"],
    },
    yiwu: {
      name: "義烏倉（海快）",
      address: "中國-浙江省-金華市-義烏市 江東街道東新路19號1號樓",
      phone: "13682536948",
      features: ["免費面單模糊", "海運快遞"],
    },
    shenzhen: {
      name: "深圳倉（空運、海快）",
      address: "中國-廣東省-深圳市-寶安區 福海街道福安路145號",
      phone: "13682536948",
      features: ["空運", "海運快遞", "物流選擇"],
    },
  };

  const data = warehouseData[warehouse];
  document.getElementById("warehouseName").textContent = data.name;
  document.getElementById("warehouseAddress").textContent = data.address;
  document.getElementById("warehousePhone").textContent = data.phone;

  // 更新特色標籤
  const featuresHtml = data.features
    .map((f) => `<span class="feature-tag">${f}</span>`)
    .join("");
  document.querySelector(".warehouse-features").innerHTML = featuresHtml;
}

// 複製功能
function copyAddress() {
  const address = document.getElementById("warehouseAddress").textContent;
  copyToClipboard(address);
}

function copyPhone() {
  const phone = document.getElementById("warehousePhone").textContent;
  copyToClipboard(phone);
}

function copyToClipboard(text) {
  // 建立臨時輸入框
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  showToast("已複製到剪貼簿！");
}

// 輪播圖功能
function startBannerSlider() {
  const slides = document.querySelectorAll(".banner-slide");
  const indicators = document.querySelectorAll(".indicator");
  let currentSlide = 0;

  if (slides.length === 0) return;

  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    indicators[currentSlide].classList.remove("active");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");
  }, 5000);
}

// 更新匯率
function updateExchangeRate() {
  const updateTime = document.getElementById("updateTime");
  if (updateTime) {
    const now = new Date();
    const timeString = now.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
    updateTime.textContent = timeString;
  }
}

// 回到頂部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// 顯示提示訊息
function showToast(message, duration = 3000) {
  // 移除現有的提示
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // 建立新提示
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  // 自動移除
  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 格式化價格
function formatPrice(price) {
  return `NT$ ${price.toLocaleString()}`;
}

// 計算總價
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// API 請求函數（預留給後端整合）
async function apiRequest(endpoint, method = "GET", data = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`/api${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
