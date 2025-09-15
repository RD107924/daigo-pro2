// 購物車頁面功能
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size: 80px; color: #ddd; margin-bottom: 20px;"></i><p>購物車是空的</p><button onclick="window.location.href=\\'/\\'" style="background: #EE4D2D; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer;">繼續購物</button></div>';
        updateSummary();
        return;
    }
    
    let itemsHTML = '';
    cart.forEach((item, index) => {
        itemsHTML += '<div class="cart-item">';
        itemsHTML += '<div class="item-image"><img src="' + item.image + '" alt="' + item.title + '"></div>';
        itemsHTML += '<div class="item-details">';
        itemsHTML += '<h3>' + item.title + '</h3>';
        itemsHTML += '<p style="color: #EE4D2D; font-size: 18px; font-weight: bold;">NT$ ' + item.price.toLocaleString() + '</p>';
        itemsHTML += '<div class="quantity-control">';
        itemsHTML += '<button class="quantity-btn" onclick="updateQuantity(' + index + ', -1)">-</button>';
        itemsHTML += '<input type="number" value="' + item.quantity + '" min="1" style="width: 50px; text-align: center;" onchange="setQuantity(' + index + ', this.value)">';
        itemsHTML += '<button class="quantity-btn" onclick="updateQuantity(' + index + ', 1)">+</button>';
        itemsHTML += '<button style="margin-left: 20px; color: #999; border: none; background: none; cursor: pointer;" onclick="removeItem(' + index + ')"><i class="fas fa-trash"></i> 移除</button>';
        itemsHTML += '</div></div></div>';
    });
    
    cartItems.innerHTML = itemsHTML;
    updateSummary();
}

function updateQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function setQuantity(index, value) {
    cart[index].quantity = Math.max(1, parseInt(value) || 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    if (confirm('確定要移除此商品嗎？')) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = Math.round(subtotal * 0.08);
    const shippingFee = cart.length > 0 ? 350 : 0;
    const total = subtotal + serviceFee + shippingFee;
    
    const subtotalEl = document.getElementById('subtotal');
    const serviceFeeEl = document.getElementById('serviceFee');
    const shippingFeeEl = document.getElementById('shippingFee');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = 'NT$ ' + subtotal.toLocaleString();
    if (serviceFeeEl) serviceFeeEl.textContent = 'NT$ ' + serviceFee.toLocaleString();
    if (shippingFeeEl) shippingFeeEl.textContent = 'NT$ ' + shippingFee.toLocaleString();
    if (totalEl) totalEl.textContent = 'NT$ ' + total.toLocaleString();
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('購物車是空的！');
        return;
    }
    window.location.href = '/checkout';
}

// 頁面載入時執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCart);
} else {
    renderCart();
}
