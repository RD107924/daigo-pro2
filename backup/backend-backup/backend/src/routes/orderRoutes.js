const express = require('express');
const router = express.Router();

let orders = [];

router.post('/create', (req, res) => {
    const order = {
        orderId: 'ORD' + Date.now(),
        ...req.body,
        status: 'pending_payment',
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    
    res.json({
        success: true,
        data: order
    });
});

router.get('/', (req, res) => {
    res.json({
        success: true,
        data: orders
    });
});

router.get('/:orderId', (req, res) => {
    const order = orders.find(o => o.orderId === req.params.orderId);
    
    if (order) {
        res.json({
            success: true,
            data: order
        });
    } else {
        res.status(404).json({
            success: false,
            message: '訂單不存在'
        });
    }
});

router.put('/:orderId/status', (req, res) => {
    const order = orders.find(o => o.orderId === req.params.orderId);
    
    if (order) {
        order.status = req.body.status;
        order.updatedAt = new Date().toISOString();
        
        res.json({
            success: true,
            data: order
        });
    } else {
        res.status(404).json({
            success: false,
            message: '訂單不存在'
        });
    }
});

module.exports = router;
