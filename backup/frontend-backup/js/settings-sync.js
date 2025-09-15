// 簡單的設定同步
function loadPlatformSettings() {
    const settings = localStorage.getItem('platformSettings');
    if (settings) {
        return JSON.parse(settings);
    }
    // 預設值
    return {
        bankName: '台灣銀行',
        bankCode: '004',
        bankAccount: '123-456-789012',
        accountName: '代購平台有限公司',
        serviceFeeRate: 8,
        baseShippingFee: 350
    };
}

// 在付款頁面使用
if (window.location.pathname.includes('payment-upload')) {
    const settings = loadPlatformSettings();
    
    window.addEventListener('DOMContentLoaded', () => {
        // 更新銀行資訊
        const bankElements = {
            name: document.getElementById('bankName'),
            code: document.getElementById('bankCode'),
            account: document.getElementById('bankAccount'),
            accountName: document.getElementById('accountName')
        };
        
        if (bankElements.name) bankElements.name.textContent = settings.bankName;
        if (bankElements.code) bankElements.code.textContent = settings.bankCode;
        if (bankElements.account) bankElements.account.textContent = settings.bankAccount;
        if (bankElements.accountName) bankElements.accountName.textContent = settings.accountName;
    });
}

// 在結帳頁面使用
if (window.location.pathname.includes('checkout')) {
    const settings = loadPlatformSettings();
    
    window.addEventListener('DOMContentLoaded', () => {
        // 更新銀行資訊
        const paymentOption = document.querySelector('.payment-option');
        if (paymentOption) {
            paymentOption.innerHTML = '<h4>銀行轉帳</h4>' +
                '<p>' + settings.bankName + ' (' + settings.bankCode + ')</p>' +
                '<p>帳號：' + settings.bankAccount + '</p>' +
                '<p>戶名：' + settings.accountName + '</p>';
        }
        
        // 更新費率
        window.serviceFeeRate = settings.serviceFeeRate / 100;
        window.shippingFee = settings.baseShippingFee;
    });
}
