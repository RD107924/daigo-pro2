const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 提供靜態檔案
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// 首頁路由 - 使用 home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/home.html'));
});

// 管理後台路由
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/dashboard.html'));
});

// 頁面路由
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/checkout.html'));
});

app.get('/order-tracking', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/order-tracking.html'));
});

app.get('/payment-upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/payment-upload.html'));
});

app.get('/product-detail', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/product-detail.html'));
});

app.get('/member-center', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/member-center.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/contact.html'));
});

app.get('/member-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/member-login.html'));
});

// API 路由
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

app.get('/api/warehouses', (req, res) => {
    res.json([
        {
            id: 'xiamen',
            name: '廈門漳州倉（海快）',
            address: '中國-福建省-漳州市-龍海區'
        }
    ]);
});

// 404 處理
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
            <meta charset="UTF-8">
            <title>404 - 頁面不存在</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                h1 { color: #EE4D2D; }
                a { color: #3498db; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>404 - 頁面不存在</h1>
            <p>您訪問的頁面不存在</p>
            <a href="/">返回首頁</a>
        </body>
        </html>
    `);
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin/login`);
});
