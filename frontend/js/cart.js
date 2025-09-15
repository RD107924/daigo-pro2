// cart.js - 購物車功能
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 加入購物車
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('商品已加入購物車！');
}

// 更新購物車數量顯示
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'block' : 'none';
    }
}

// 顯示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 計算總價
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = subtotal * 0.08; // 8% 服務費
    const shippingFee = 350; // 固定運費
    const total = subtotal + serviceFee + shippingFee;
    
    return {
        subtotal,
        serviceFee,
        shippingFee,
        total
    };
}

// 初始化
document.addEventListener('DOMContentLoaded', updateCartCount);
