const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(cors());
app.use(bodyParser.json({limit: "10mb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"}));

// 靜態文件服務
app.use(express.static(path.join(__dirname, "public")));

// 設定API - 重要：管理後台設定同步
app.get("/api/settings", (req, res) => {
    const settingsPath = path.join(__dirname, "data/settings.json");
    let settings = {
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
    
    // 讀取保存的設定
    if (fs.existsSync(settingsPath)) {
        try {
            const savedSettings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
            settings = {...settings, ...savedSettings};
        } catch (error) {
            console.error("讀取設定失敗:", error);
        }
    }
    
    res.json({success: true, data: settings});
});

app.post("/api/settings", (req, res) => {
    const settingsPath = path.join(__dirname, "data/settings.json");
    
    // 確保目錄存在
    if (!fs.existsSync(path.dirname(settingsPath))) {
        fs.mkdirSync(path.dirname(settingsPath), {recursive: true});
    }
    
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(req.body, null, 2));
        res.json({success: true, message: "設定已保存"});
    } catch (error) {
        console.error("保存設定失敗:", error);
        res.status(500).json({success: false, message: "保存失敗"});
    }
});

// 簡化的API路由
app.get("/api/products", (req, res) => {
    const products = [
        {
            id: 1,
            title: "日本 SK-II 神仙水精華液 230ml",
            price: 4850,
            originalPrice: 5800,
            image: "https://via.placeholder.com/300x300/FFB6C1/FFFFFF?text=SK-II",
            category: "beauty",
            source: "日本"
        },
        {
            id: 2,
            title: "Apple AirPods Pro 2",
            price: 6990,
            originalPrice: 7990,
            image: "https://via.placeholder.com/300x300/87CEEB/FFFFFF?text=AirPods",
            category: "electronics",
            source: "美國"
        }
    ];
    res.json({success: true, data: products});
});

app.post("/api/orders", (req, res) => {
    const order = {
        orderId: "ORD" + Date.now(),
        ...req.body,
        status: "pending_payment",
        createdAt: new Date().toISOString()
    };
    
    res.json({success: true, data: order});
});

// 頁面路由
const pages = [
    {route: "/", file: "home.html"},
    {route: "/cart", file: "cart.html"},
    {route: "/checkout", file: "checkout.html"},
    {route: "/payment-upload", file: "payment-upload.html"},
    {route: "/order-tracking", file: "order-tracking.html"},
    {route: "/product-detail", file: "product-detail.html"},
    {route: "/member-center", file: "member-center.html"},
    {route: "/member-login", file: "member-login.html"},
    {route: "/contact", file: "contact.html"}
];

pages.forEach(({route, file}) => {
    app.get(route, (req, res) => {
        const filePath = path.join(__dirname, "public/pages", file);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send("頁面不存在: " + file);
        }
    });

// 添加註冊路由
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public/pages/register.html"));
});

app.get("/member-login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/pages/member-login.html"));
});

});

// 管理後台路由
app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin/login.html"));
});

app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public/admin/dashboard.html"));
});

// 健康檢查
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// 錯誤處理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "服務器錯誤"
    });
});

// 404處理
app.use((req, res) => {
    res.status(404).send("<h1>404 - 頁面不存在</h1><p><a href=\"/\">返回首頁</a></p>");
});

app.listen(PORT, () => {
    console.log("==========================================");
    console.log(" 代購平台服務器已啟動");
    console.log(` 前台: http://localhost:${PORT}`);
    console.log(` 後台: http://localhost:${PORT}/admin/login`);
    console.log(` API: http://localhost:${PORT}/api/health`);
    console.log("==========================================");
});

