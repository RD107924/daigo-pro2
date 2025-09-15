// 初始化範例商品
function initSampleProducts() {
    const existingProducts = localStorage.getItem('products');
    
    // 如果已有商品就不初始化
    if (existingProducts) {
        return;
    }
    
    const sampleProducts = [
        {
            id: 1,
            title: "日本 SK-II 神仙水精華液 230ml",
            price: 4850,
            originalPrice: 5800,
            image: "https://via.placeholder.com/300x300/FFE5E5/FF6B6B?text=SK-II",
            category: "beauty",
            stock: 50,
            source: "日本",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            title: "Nike Air Jordan 1 Retro High OG",
            price: 5200,
            originalPrice: 6500,
            image: "https://via.placeholder.com/300x300/E5F5FF/4DABF7?text=AJ1",
            category: "clothing",
            stock: 30,
            source: "美國",
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            title: "Apple AirPods Pro 2",
            price: 6990,
            originalPrice: 7990,
            image: "https://via.placeholder.com/300x300/F0F0F0/666666?text=AirPods",
            category: "electronics",
            stock: 100,
            source: "美國",
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            title: "MUJI 無印良品 超音波香薰機",
            price: 1580,
            originalPrice: 1980,
            image: "https://via.placeholder.com/300x300/FFF5E5/FFB84D?text=MUJI",
            category: "home",
            stock: 45,
            source: "日本",
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    console.log('範例商品已初始化');
}

// 執行初始化
initSampleProducts();
