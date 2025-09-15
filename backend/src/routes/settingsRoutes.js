const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 設定檔案路徑
const settingsFile = path.join(__dirname, '../../../config/settings.json');

// 取得設定
router.get('/settings', (req, res) => {
    try {
        // 從 localStorage 或檔案讀取設定
        const settings = {
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
        
        // 如果檔案存在，讀取檔案
        if (fs.existsSync(settingsFile)) {
            const fileSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
            Object.assign(settings, fileSettings);
        }
        
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新設定
router.post('/settings', (req, res) => {
    try {
        const settings = req.body;
        
        // 確保目錄存在
        const dir = path.dirname(settingsFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // 寫入檔案
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
        
        res.json({ success: true, message: '設定已更新' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
