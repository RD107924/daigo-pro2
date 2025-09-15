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

// API 路由
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// 頁面路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/checkout.html'));
});

app.get('/payment-upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/payment-upload.html'));
});

app.get('/order-tracking', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/order-tracking.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/dashboard.html'));
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
    res.status(404).send('頁面不存在');
});

// 錯誤處理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('伺服器錯誤！');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin/login`);
});
