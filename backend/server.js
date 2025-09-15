// server.js - 代購平台後端主程式
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

// 重要：提供靜態檔案
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// 根路徑提供 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
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
        data: [
            {
                id: 1,
                title: "測試商品",
                price: 999,
                image: "https://via.placeholder.com/300"
            }
        ]
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
    res.status(404).send('頁面不存在');
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Static files served from: ${path.join(__dirname, '../frontend')}`);
});
