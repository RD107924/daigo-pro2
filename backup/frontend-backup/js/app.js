console.log("APP.JS 已載入！");

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM 載入完成");
    
    // 初始化一些測試商品到 localStorage
    if (!localStorage.getItem('products')) {
        const testProducts = [
            {
                id: 1,
                title: "測試商品1 - iPhone",
                price: 30000,
                image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=iPhone",
                category: "electronics"
            },
            {
                id: 2,
                title: "測試商品2 - 化妝品",
                price: 5000,
                image: "https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Beauty",
                category: "beauty"
            }
        ];
        localStorage.setItem('products', JSON.stringify(testProducts));
        console.log("已初始化測試商品");
    }
    
    // 顯示商品
    const productsGrid = document.getElementById("productsGrid");
    if (productsGrid) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        console.log("商品數量:", products.length);
        
        if (products.length > 0) {
            let html = '';
            products.forEach(p => {
                html += '<div class="product-card"><div class="product-image">';
                html += '<img src="' + p.image + '" alt="' + p.title + '">';
                html += '</div><div class="product-info">';
                html += '<div class="product-title">' + p.title + '</div>';
                html += '<div class="product-price">NT$ ' + p.price + '</div>';
                html += '</div></div>';
            });
            productsGrid.innerHTML = html;
            console.log("商品已顯示");
        }
    } else {
        console.log("找不到 productsGrid");
    }
});

// 空函數避免錯誤
function updateCartCount() {}
function checkMemberInfo() {}
function startBannerSlider() {}
function updateExchangeRate() {}
function showMemberInfo() { alert('會員中心'); }
function showWarehouseInfo() { alert('倉庫資訊'); }
function closeWarehouseModal() {}
function closeMemberModal() {}
function scrollToTop() { window.scrollTo(0, 0); }
