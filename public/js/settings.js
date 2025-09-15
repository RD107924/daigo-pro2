// settings.js - 讀取平台設定
class PlatformSettings {
    constructor() {
        this.settings = this.loadSettings();
    }
    
    loadSettings() {
        // 從 localStorage 載入設定，如果沒有則使用預設值
        const saved = localStorage.getItem('platformSettings');
        const defaults = {
            platformName: '代購平台',
            platformSlogan: '您的海外購物專家',
            servicePhone: '0800-123-456',
            serviceEmail: 'service@daigou.com',
            serviceFeeRate: 8,
            exchangeRate: 4.45,
            bankName: '台灣銀行',
            bankCode: '004',
            bankAccount: '123-456-789012',
            accountName: '代購平台有限公司',
            baseShippingFee: 350,
            freeShippingThreshold: 5000,
            airShippingExtra: 200
        };
        
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }
    
    get(key) {
        return this.settings[key];
    }
    
    getAll() {
        return this.settings;
    }
    
    // 更新頁面上的設定值
    updatePageSettings() {
        // 更新平台名稱
        const platformNames = document.querySelectorAll('.platform-name');
        platformNames.forEach(el => {
            el.textContent = this.settings.platformName;
        });
        
        // 更新銀行資訊
        const bankInfo = document.querySelectorAll('.bank-info');
        bankInfo.forEach(el => {
            el.innerHTML = `
                <p>銀行：${this.settings.bankName} (${this.settings.bankCode})</p>
                <p>帳號：${this.settings.bankAccount}</p>
                <p>戶名：${this.settings.accountName}</p>
            `;
        });
        
        // 更新服務費率
        if (window.calculateServiceFee) {
            window.serviceFeeRate = this.settings.serviceFeeRate / 100;
        }
        
        // 更新運費
        if (window.shippingFee) {
            window.shippingFee = this.settings.baseShippingFee;
        }
    }
}

// 建立全域實例
const platformSettings = new PlatformSettings();

// 頁面載入時自動更新設定
document.addEventListener('DOMContentLoaded', () => {
    platformSettings.updatePageSettings();
});
