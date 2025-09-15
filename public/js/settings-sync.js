// 設定同步腳本
var SettingsSync = {
    saveSettings: function(settings) {
        return new Promise(function(resolve, reject) {
            try {
                localStorage.setItem("platformSettings", JSON.stringify(settings));
                
                fetch("/api/settings", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(settings)
                })
                .then(function(response) {
                    if (response.ok) {
                        var event = new CustomEvent("settingsUpdated", {detail: settings});
                        window.dispatchEvent(event);
                        resolve({success: true});
                    } else {
                        throw new Error("服務器保存失敗");
                    }
                })
                .catch(function(error) {
                    reject({success: false, error: error.message});
                });
            } catch (error) {
                console.error("設定保存失敗:", error);
                reject({success: false, error: error.message});
            }
        });
    },
    
    loadSettings: function() {
        return new Promise(function(resolve, reject) {
            try {
                fetch("/api/settings")
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    if (result.success) {
                        localStorage.setItem("platformSettings", JSON.stringify(result.data));
                        resolve(result.data);
                    } else {
                        throw new Error("載入設定失敗");
                    }
                })
                .catch(function(error) {
                    console.error("設定載入失敗:", error);
                    var defaultSettings = {
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
                    
                    var saved = localStorage.getItem("platformSettings");
                    resolve(saved ? JSON.parse(saved) : defaultSettings);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};

// 監聽設定更新事件
window.addEventListener("settingsUpdated", function(event) {
    if (window.daigouApp) {
        window.daigouApp.settings = event.detail;
        window.daigouApp.updateBankInfo();
        window.daigouApp.updateCartSummary();
        console.log(" 設定已同步更新", event.detail);
    }
});

// 頁面載入時自動載入設定
document.addEventListener("DOMContentLoaded", function() {
    SettingsSync.loadSettings()
    .then(function(settings) {
        console.log(" 設定已載入:", settings);
    })
    .catch(function(error) {
        console.error("設定載入失敗:", error);
    });
});

window.SettingsSync = SettingsSync;
