// 簡化測試版
document.addEventListener("DOMContentLoaded", function() {
    console.log("頁面載入中...");
    
    // 直接從 localStorage 讀取並顯示商品
    const productsGrid = document.getElementById("productsGrid");
    if (!productsGrid) {
        console.log("找不到商品網格");
        return;
    }
    
    // 讀取商品
    let products = [];
    try {
        const stored = localStorage.getItem('products');
        console.log("localStorage 內容:", stored);
        if (stored) {
            products = JSON.parse(stored);
        }
    } catch (e) {
        console.error("解析商品失敗:", e);
    }
    
    console.log("找到商品數量:", products.length);
    
    // 如果沒有商品，使用預設商品
    if (products.length === 0) {
        console.log("沒有商品，使用預設值");
        products = [
            {
                id: 1,
                title: "預設商品 - SK-II",
                price: 4850,
                image: "https://via.placeholder.com/300x300/FFE5E5/FF6B6B?text=SK-II",
                category: "beauty"
            }
        ];
        // 儲存預設商品
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // 顯示商品
    productsGrid.innerHTML = products.map(product => {
        return '<div class="product-card" style="cursor: pointer;" onclick="alert(\'商品ID: ' + product.id + '\')">' +
            '<div class="product-image">' +
            '<img src="' + (product.image || 'https://via.placeholder.com/300') + '" alt="' + product.title + '">' +
            '</div>' +
            '<div class="product-info">' +
            '<div class="product-title">' + product.title + '</div>' +
            '<div class="product-price">' +
            '<span class="price-current">NT$ ' + (product.price || 0).toLocaleString() + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
    }).join('');
    
    console.log("商品已顯示");
});

// 其他必要功能
function updateCartCount() {}
function showMemberInfo() { alert('會員中心'); }
function closeMemberModal() {}
function showWarehouseInfo() { alert('倉庫資訊'); }
function closeWarehouseModal() {}
function scrollToTop() { window.scrollTo(0, 0); }
function checkMemberInfo() {}
function startBannerSlider() {}
function updateExchangeRate() {}
