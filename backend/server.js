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

// 載入 API 路由
try {
    const userRoutes = require('./src/routes/userRoutes');
    const productRoutes = require('./src/routes/productRoutes'); 
    const orderRoutes = require('./src/routes/orderRoutes');
    const adminRoutes = require('./src/routes/adminRoutes');
    const paymentRoutes = require('./src/routes/paymentRoutes');
    const settingsRoutes = require('./src/routes/settingsRoutes');

    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/settings', settingsRoutes);
} catch (error) {
    console.log('某些路由模組未找到，繼續啟動...');
}

// 首頁路由 - 優先檢查 index.html，沒有就用 home.html
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/pages/index.html');
    const homePath = path.join(__dirname, '../frontend/pages/home.html');
    
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else if (require('fs').existsSync(homePath)) {
        res.sendFile(homePath);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="zh-TW">
            <head>
                <meta charset="UTF-8">
                <title>代購平台</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; }
                    h1 { color: #EE4D2D; margin-bottom: 30px; }
                    .btn { background: #EE4D2D; color: white; padding: 12px 30px; border: none; border-radius: 25px; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>代購平台</h1>
                <p>您的海外購物專家</p>
                <a href="/admin/login" class="btn">管理後台</a>
            </body>
            </html>
        `);
    }
});

// 其他頁面路由
const routes = [
    { path: '/cart', file: 'cart.html' },
    { path: '/checkout', file: 'checkout.html' },
    { path: '/order-tracking', file: 'order-tracking.html' },
    { path: '/payment-upload', file: 'payment-upload.html' },
    { path: '/product-detail', file: 'product-detail.html' },
    { path: '/member-center', file: 'member-center.html' },
    { path: '/contact', file: 'contact.html' },
    { path: '/member-login', file: 'member-login.html' }
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        const filePath = path.join(__dirname, '../frontend/pages', route.file);
        if (require('fs').existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send(`檔案 ${route.file} 不存在`);
        }
    });
});

// 管理後台路由
app.get('/admin', (req, res) => res.redirect('/admin/login'));
app.get('/admin/login', (req, res) => {
    const loginPath = path.join(__dirname, '../frontend/admin/login.html');
    if (require('fs').existsSync(loginPath)) {
        res.sendFile(loginPath);
    } else {
        res.status(404).send('管理後台登入頁面不存在');
    }
});

app.get('/admin/dashboard', (req, res) => {
    const dashboardPath = path.join(__dirname, '../frontend/admin/dashboard.html');
    if (require('fs').existsSync(dashboardPath)) {
        res.sendFile(dashboardPath);
    } else {
        res.status(404).send('管理後台儀表板不存在');
    }
});

// API 健康檢查
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
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
            <p>您訪問的頁面不存在: ${req.path}</p>
            <a href="/">返回首頁</a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('==========================================');
    console.log(' 代購平台服務器已啟動');
    console.log(` 前台: http://localhost:${PORT}`);
    console.log(` 後台: http://localhost:${PORT}/admin/login`);
    console.log(` API: http://localhost:${PORT}/api/health`);
    console.log('==========================================');
});
