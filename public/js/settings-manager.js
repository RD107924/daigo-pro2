// 全域設定管理器
const SettingsManager = {
    settings: null,
    
    // 載入設定
    async loadSettings() {
        try {
            // 優先從 API 載入
            const response = await fetch('/api/settings/settings');
            if (response.ok) {
                const data = await response.json();
                this.settings = data.data;
                return this.settings;
            }
        } catch (error) {
            console.log('從 API 載入設定失敗，使用本地設定');
        }
        
        // 從 localStorage 載入
        const localSettings = localStorage.getItem('platformSettings');
        if (localSettings) {
            this.settings = JSON.parse(localSettings);
        } else {
            // 使用預設值
            this.settings = {
                platformName: '代購平台',
                bankName: '台灣銀行',
                bankCode: '004',
                bankAccount: '123-456-789012',
                accountName: '代購平台有限公司',
                serviceFeeRate: 8,
                exchangeRate: 4.45,
                baseShippingFee: 350,
                freeShippingThreshold: 5000
            };
        }
        return this.settings;
    },
    
    // 取得特定設定
    get(key) {
        if (!this.settings) {
            this.loadSettings();
        }
        return this.settings ? this.settings[key] : null;
    },
    
    // 更新頁面上的銀行資訊
    updateBankInfo() {
        const bankInfoElements = document.querySelectorAll('.bank-info');
        bankInfoElements.forEach(element => {
            const bankName = element.querySelector('[data-bank-name]');
            const bankCode = element.querySelector('[data-bank-code]');
            const bankAccount = element.querySelector('[data-bank-account]');
            const accountName = element.querySelector('[data-account-name]');
            
            if (bankName) bankName.textContent = this.settings.bankName;
            if (bankCode) bankCode.textContent = this.settings.bankCode;
            if (bankAccount) bankAccount.textContent = this.settings.bankAccount;
            if (accountName) accountName.textContent = this.settings.accountName;
        });
    }
};

// 頁面載入時自動載入設定
document.addEventListener('DOMContentLoaded', async () => {
    await SettingsManager.loadSettings();
    SettingsManager.updateBankInfo();
});
