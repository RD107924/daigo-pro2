// 代購平台統一應用管理器
class DaigouPlatform {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.settings = this.loadSettings();
        this.currentUser = JSON.parse(localStorage.getItem("memberInfo")) || null;
        this.init();
    }

    init() {
        console.log(" 代購平台已初始化");
        this.initializeData();
        this.bindGlobalEvents();
        this.updateUI();
        
        const page = this.getCurrentPage();
        this.initPage(page);
    }

    loadSettings() {
        const defaultSettings = {
            platformName: "代購平台",
            serviceFeeRate: 8,
            exchangeRate: 4.45,
            baseShippingFee: 350,
            freeShippingThreshold: 5000,
            bankName: "台灣銀行",
            bankCode: "004",
            bankAccount: "123-456-789012",
            accountName: "代購平台有限公司"
        };
        
        const saved = localStorage.getItem("platformSettings");
        return saved ? Object.assign(defaultSettings, JSON.parse(saved)) : defaultSettings;
    }

    initializeData() {
        if (!localStorage.getItem("products")) {
            const sampleProducts = [
                {
                    id: 1,
                    title: "日本 SK-II 神仙水精華液 230ml",
                    price: 4850,
                    originalPrice: 5800,
                    image: "https://via.placeholder.com/300x300/FFB6C1/FFFFFF?text=SK-II",
                    category: "beauty",
                    source: "日本",
                    stock: 50,
                    rating: 4.8,
                    sold: 2341,
                    badge: "熱銷"
                },
                {
                    id: 2,
                    title: "Apple AirPods Pro 2",
                    price: 6990,
                    originalPrice: 7990,
                    image: "https://via.placeholder.com/300x300/87CEEB/FFFFFF?text=AirPods",
                    category: "electronics",
                    source: "美國",
                    stock: 100,
                    rating: 4.7,
                    sold: 3421
                },
                {
                    id: 3,
                    title: "Nike Air Jordan 1 Retro High OG",
                    price: 5200,
                    originalPrice: 6500,
                    image: "https://via.placeholder.com/300x300/FF6347/FFFFFF?text=Jordan",
                    category: "clothing",
                    source: "美國",
                    stock: 30,
                    rating: 4.9,
                    sold: 1523,
                    badge: "限量"
                },
                {
                    id: 4,
                    title: "MUJI 無印良品 超音波香薰機",
                    price: 1580,
                    originalPrice: 1980,
                    image: "https://via.placeholder.com/300x300/FFB84D/FFFFFF?text=MUJI",
                    category: "home",
                    source: "日本",
                    stock: 45,
                    rating: 4.6,
                    sold: 892
                }
            ];
            localStorage.setItem("products", JSON.stringify(sampleProducts));
            console.log(" 商品數據已初始化");
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes("admin")) return "admin";
        if (path.includes("cart")) return "cart";
        if (path.includes("checkout")) return "checkout";
        if (path.includes("payment")) return "payment";
        if (path.includes("tracking")) return "tracking";
        if (path.includes("product-detail")) return "productDetail";
        return "home";
    }

    initPage(page) {
        switch(page) {
            case "home":
                this.initHomePage();
                break;
            case "cart":
                this.initCartPage();
                break;
            case "checkout":
                this.initCheckoutPage();
                break;
            case "payment":
                this.initPaymentPage();
                break;
            case "admin":
                this.initAdminPage();
                break;
        }
    }

    initHomePage() {
        setTimeout(() => {
            this.renderProducts();
            this.updateExchangeRate();
        }, 100);
    }

    initCartPage() {
        this.renderCart();
        this.updateCartSummary();
    }

    initCheckoutPage() {
        this.populateMemberInfo();
        this.calculateOrderTotal();
        this.updateBankInfo();
    }

    initPaymentPage() {
        this.loadOrderInfo();
        this.updateBankInfo();
    }

    initAdminPage() {
        this.loadAdminData();
        this.bindAdminEvents();
    }

    renderProducts() {
        const grid = document.getElementById("productsGrid");
        if (!grid) {
            console.log("找不到商品網格元素");
            return;
        }

        const products = JSON.parse(localStorage.getItem("products")) || [];
        console.log("載入商品數量:", products.length);
        
        if (products.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暫無商品</div>';
            return;
        }

        let html = "";
        
        products.forEach(function(product) {
            html += '<div class="product-card" onclick="viewProduct(' + product.id + ')">';
            html += '<div class="product-image">';
            html += '<img src="' + product.image + '" alt="' + product.title + '" ';
            html += 'onerror="this.src=\'https://via.placeholder.com/300x300?text=No+Image\'">';
            if (product.badge) {
                html += '<span class="product-badge">' + product.badge + '</span>';
            }
            html += '</div>';
            html += '<div class="product-info">';
            html += '<div class="product-title">' + product.title + '</div>';
            html += '<div class="product-price">';
            html += '<span class="price-current">NT$ ' + product.price.toLocaleString() + '</span>';
            if (product.originalPrice) {
                html += '<span class="price-original">NT$ ' + product.originalPrice.toLocaleString() + '</span>';
            }
            html += '</div>';
            html += '<div class="product-meta">';
            html += '<span class="product-source">' + product.source + '</span>';
            html += '<span class="product-rating"> ' + product.rating + '</span>';
            html += '</div>';
            html += '<button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(' + product.id + ')">';
            html += '加入購物車';
            html += '</button>';
            html += '</div></div>';
        });
        
        grid.innerHTML = html;
        console.log(" 商品已渲染完成");
    }

    renderCart() {
        const container = document.getElementById("cartItems");
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = 
                '<div class="empty-cart">' +
                '<i class="fas fa-shopping-cart"></i>' +
                '<h3>購物車是空的</h3>' +
                '<button onclick="window.location.href=\'/\'" class="btn btn-primary">繼續購物</button>' +
                '</div>';
            return;
        }

        let html = "";
        const self = this;
        this.cart.forEach(function(item, index) {
            html += '<div class="cart-item">';
            html += '<img src="' + item.image + '" alt="' + item.title + '" class="item-image">';
            html += '<div class="item-details">';
            html += '<h4>' + item.title + '</h4>';
            html += '<p class="item-price">NT$ ' + item.price.toLocaleString() + '</p>';
            html += '<div class="quantity-controls">';
            html += '<button onclick="updateQuantity(' + index + ', -1)">-</button>';
            html += '<span>' + item.quantity + '</span>';
            html += '<button onclick="updateQuantity(' + index + ', 1)">+</button>';
            html += '<button onclick="removeFromCart(' + index + ')" class="remove-btn">移除</button>';
            html += '</div></div></div>';
        });
        
        container.innerHTML = html;
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
        }, 0);
        const serviceFee = Math.round(subtotal * (this.settings.serviceFeeRate / 100));
        const shippingFee = subtotal >= this.settings.freeShippingThreshold ? 0 : this.settings.baseShippingFee;
        const total = subtotal + serviceFee + shippingFee;

        this.updateElement("subtotal", "NT$ " + subtotal.toLocaleString());
        this.updateElement("serviceFee", "NT$ " + serviceFee.toLocaleString());
        this.updateElement("shippingFee", "NT$ " + shippingFee.toLocaleString());
        this.updateElement("totalAmount", "NT$ " + total.toLocaleString());
    }

    updateBankInfo() {
        this.updateElement("bankName", this.settings.bankName);
        this.updateElement("bankCode", this.settings.bankCode);
        this.updateElement("bankAccount", this.settings.bankAccount);
        this.updateElement("accountName", this.settings.accountName);
        
        const bankInfos = document.querySelectorAll(".bank-info");
        const self = this;
        bankInfos.forEach(function(info) {
            info.innerHTML = 
                '<p>銀行：' + self.settings.bankName + ' (' + self.settings.bankCode + ')</p>' +
                '<p>帳號：' + self.settings.bankAccount + '</p>' +
                '<p>戶名：' + self.settings.accountName + '</p>';
        });
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }

    updateUI() {
        this.updateCartCount();
        this.updateUserInfo();
    }

    updateCartCount() {
        const count = this.cart.reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);
        const badges = document.querySelectorAll(".cart-badge, #cartCount");
        badges.forEach(function(badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? "block" : "none";
        });
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userElements = document.querySelectorAll(".user-name");
            const userName = this.currentUser.memberName || "會員";
            userElements.forEach(function(el) {
                el.textContent = userName;
            });
        }
    }

    bindGlobalEvents() {
        const searchBtn = document.querySelector(".search-btn");
        const searchInput = document.querySelector(".search-input");
        const self = this;
        
        if (searchBtn) {
            searchBtn.addEventListener("click", function() {
                self.handleSearch();
            });
        }
        if (searchInput) {
            searchInput.addEventListener("keypress", function(e) {
                if (e.key === "Enter") {
                    self.handleSearch();
                }
            });
        }
    }

    handleSearch() {
        const input = document.querySelector(".search-input");
        const query = input ? input.value.trim().toLowerCase() : "";
        if (!query) return;

        const products = JSON.parse(localStorage.getItem("products")) || [];
        const filtered = products.filter(function(p) {
            return p.title.toLowerCase().includes(query) ||
                   p.category.toLowerCase().includes(query);
        });

        this.renderFilteredProducts(filtered);
    }

    renderFilteredProducts(products) {
        const grid = document.getElementById("productsGrid");
        if (!grid) return;
        
        if (products.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">找不到相關商品</div>';
        } else {
            let html = "";
            products.forEach(function(product) {
                html += '<div class="product-card" onclick="viewProduct(' + product.id + ')">';
                html += '<div class="product-image">';
                html += '<img src="' + product.image + '" alt="' + product.title + '">';
                html += '</div>';
                html += '<div class="product-info">';
                html += '<div class="product-title">' + product.title + '</div>';
                html += '<div class="product-price">';
                html += '<span class="price-current">NT$ ' + product.price.toLocaleString() + '</span>';
                html += '</div></div></div>';
            });
            grid.innerHTML = html;
        }
    }

    updateExchangeRate() {
        const rateElements = document.querySelectorAll(".rate");
        const timeElements = document.querySelectorAll(".update-time");
        const self = this;
        
        rateElements.forEach(function(el) {
            el.textContent = "1 CNY = " + self.settings.exchangeRate + " TWD";
        });
        
        timeElements.forEach(function(el) {
            el.textContent = "更新時間: " + new Date().toLocaleString("zh-TW");
        });
    }

    populateMemberInfo() {}
    calculateOrderTotal() {}
    loadOrderInfo() {}
    loadAdminData() {}
    bindAdminEvents() {}
}

// 全域變數
var app = null;

// 初始化應用
document.addEventListener("DOMContentLoaded", function() {
    try {
        app = new DaigouPlatform();
        window.daigouApp = app;
        console.log(" 應用初始化成功");
    } catch (error) {
        console.error(" 應用初始化失敗:", error);
    }
});

// 商品相關函數
function viewProduct(id) {
    localStorage.setItem("currentProductId", id);
    window.location.href = "/product-detail";
}

function addToCart(id) {
    if (!app) {
        console.error("應用未初始化");
        return;
    }
    
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(function(p) { return p.id === id; });
    
    if (product) {
        const existingItem = app.cart.find(function(item) { return item.id === id; });
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = Object.assign({}, product);
            newItem.quantity = 1;
            app.cart.push(newItem);
        }
        
        localStorage.setItem("cart", JSON.stringify(app.cart));
        app.updateCartCount();
        showNotification("商品已加入購物車！");
    }
}

// 購物車相關函數
function updateQuantity(index, change) {
    if (!app) return;
    
    app.cart[index].quantity = Math.max(1, app.cart[index].quantity + change);
    localStorage.setItem("cart", JSON.stringify(app.cart));
    app.renderCart();
    app.updateCartSummary();
}

function removeFromCart(index) {
    if (!app) return;
    
    if (confirm("確定要移除此商品嗎？")) {
        app.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(app.cart));
        app.renderCart();
        app.updateCartSummary();
        app.updateCartCount();
    }
}

// 通知函數
function showNotification(message, type) {
    type = type || "success";
    const notification = document.createElement("div");
    notification.className = "notification notification-" + type;
    notification.textContent = message;
    notification.style.cssText = 
        "position: fixed; top: 20px; right: 20px; z-index: 9999;" +
        "padding: 15px 25px; border-radius: 5px; color: white;" +
        "background: " + (type === "success" ? "#4CAF50" : "#f44336") + ";";
    
    document.body.appendChild(notification);
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 其他輔助函數
function showMemberInfo() {
    const memberInfo = localStorage.getItem("memberInfo");
    if (memberInfo) {
        window.location.href = "/member-center";
    } else {
        window.location.href = "/member-login";
    }
}

function showWarehouseInfo() {
    alert("倉庫資訊功能開發中...");
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: "smooth"});
}

function checkMemberInfo() {
    const memberInfo = localStorage.getItem("memberInfo");
    return memberInfo ? JSON.parse(memberInfo) : null;
}

function updateCartCount() {
    if (window.daigouApp) {
        window.daigouApp.updateCartCount();
    }
}

function startBannerSlider() {
    const slides = document.querySelectorAll(".banner-slide");
    if (slides.length === 0) return;
    
    var currentSlide = 0;
    setInterval(function() {
        slides.forEach(function(slide, index) {
            slide.classList.toggle("active", index === currentSlide);
        });
        currentSlide = (currentSlide + 1) % slides.length;
    }, 5000);
}

function updateExchangeRate() {
    if (window.daigouApp) {
        window.daigouApp.updateExchangeRate();
    }
}
