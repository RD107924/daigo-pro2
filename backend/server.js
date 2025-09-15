// server.js - 代購平台後端主程式
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// 引入路由
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// 引入服務 - 使用條件載入
let emailService;
try {
  emailService = require("./src/services/emailService");
} catch (e) {
  console.log("⚠️ emailService 未找到或未配置");
}

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 靜態檔案服務
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/public", express.static(path.join(__dirname, "../public")));

// API 路由
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// 健康檢查
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 匯率 API
app.get("/api/exchange-rate", (req, res) => {
  // 實際應該從外部 API 獲取即時匯率
  res.json({
    CNY_TO_TWD: 4.45,
    USD_TO_TWD: 31.5,
    JPY_TO_TWD: 0.21,
    updated_at: new Date().toISOString(),
  });
});

// 倉庫資訊 API
app.get("/api/warehouses", (req, res) => {
  res.json([
    {
      id: "xiamen",
      name: "廈門漳州倉（海快）",
      address:
        "中國-福建省-漳州市-龍海區 東園鎮倉里路普洛斯物流園A02庫1樓一分區1號門",
      phone: "13682536948",
      code_prefix: "935-170",
      features: ["免費面單模糊", "隱藏機制導入", "海運快遞"],
      shipping_methods: ["sea_express"],
      estimated_days: "7-10天",
    },
    {
      id: "yiwu",
      name: "義烏倉（海快）",
      address: "中國-浙江省-金華市-義烏市 江東街道東新路19號1號樓",
      phone: "13682536948",
      code_prefix: "935-170",
      features: ["免費面單模糊", "海運快遞"],
      shipping_methods: ["sea_express"],
      estimated_days: "7-10天",
    },
    {
      id: "shenzhen",
      name: "深圳倉（空運、海快）",
      address: "中國-廣東省-深圳市-寶安區 福海街道福安路145號",
      phone: "13682536948",
      code_prefix: "935-170",
      features: ["空運", "海運快遞", "物流選擇"],
      shipping_methods: ["air", "sea_express"],
      estimated_days: "空運3-5天，海運7-10天",
    },
  ]);
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "伺服器錯誤",
      status: err.status || 500,
    },
  });
});

// 404 處理
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    res.status(404).json({ error: "API endpoint not found" });
  } else {
    res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 代購平台伺服器運行在 http://localhost:${PORT}`);
  console.log(`📊 環境: ${process.env.NODE_ENV || "development"}`);

  // 測試 SendGrid 連接
  if (process.env.SENDGRID_API_KEY) {
    console.log("✅ SendGrid 已配置");
  } else {
    console.log("⚠️  SendGrid 未配置，請設定 SENDGRID_API_KEY");
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  app.close(() => {
    console.log("HTTP server closed");
  });
});
