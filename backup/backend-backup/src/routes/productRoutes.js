const express = require('express');
const router = express.Router();

const products = [
    {
        id: 1,
        title: "日本 SK-II 神仙水精華液 230ml",
        price: 4850,
        originalPrice: 5800,
        image: "https://via.placeholder.com/300x300/FFE5E5/FF6B6B?text=SK-II",
        category: "beauty",
        sold: 2341,
        rating: 4.8,
        source: "日本",
        badge: "熱銷"
    },
    {
        id: 2,
        title: "Nike Air Jordan 1 Retro High OG",
        price: 5200,
        originalPrice: 6500,
        image: "https://via.placeholder.com/300x300/E5F5FF/4DABF7?text=AJ1",
        category: "clothing",
        sold: 1523,
        rating: 4.9,
        source: "美國",
        badge: "限量"
    },
    {
        id: 3,
        title: "Apple AirPods Pro 2",
        price: 6990,
        originalPrice: 7990,
        image: "https://via.placeholder.com/300x300/F0F0F0/666666?text=AirPods",
        category: "electronics",
        sold: 3421,
        rating: 4.7,
        source: "美國"
    },
    {
        id: 4,
        title: "MUJI 無印良品 超音波香薰機",
        price: 1580,
        originalPrice: 1980,
        image: "https://via.placeholder.com/300x300/FFF5E5/FFB84D?text=MUJI",
        category: "home",
        sold: 892,
        rating: 4.6,
        source: "日本"
    }
];

router.get('/', (req, res) => {
    res.json({
        success: true,
        data: products
    });
});

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json({
            success: true,
            data: product
        });
    } else {
        res.status(404).json({
            success: false,
            message: '產品不存在'
        });
    }
});

module.exports = router;
