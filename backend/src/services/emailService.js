// emailService.js - SendGrid 郵件服務
const sgMail = require("@sendgrid/mail");

// 設定 SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDER_EMAIL || "noreply@daigou-platform.com";
    this.adminEmail = process.env.ADMIN_EMAIL || "admin@daigou-platform.com";
  }

  // 發送新訂單通知給管理員
  async sendNewOrderNotification(orderData) {
    const {
      orderId,
      customerName,
      memberCode,
      totalAmount,
      items,
      warehouse,
      createdAt,
    } = orderData;

    const itemsList = items
      .map(
        (item) =>
          `<li>${item.title} x ${item.quantity} - NT$ ${
            item.price * item.quantity
          }</li>`
      )
      .join("");

    const msg = {
      to: this.adminEmail,
      from: this.fromEmail,
      subject: `🛒 新訂單通知 #${orderId}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                        .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                        .order-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                        .item-list { list-style: none; padding: 0; }
                        .item-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
                        .total { font-size: 18px; font-weight: bold; color: #EE4D2D; margin-top: 15px; }
                        .button { display: inline-block; padding: 12px 30px; background: #EE4D2D; color: white; text-decoration: none; border-radius: 25px; margin-top: 20px; }
                        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">🎉 新訂單通知</h1>
                            <p style="margin: 5px 0 0;">訂單編號：${orderId}</p>
                        </div>
                        
                        <div class="content">
                            <h2>訂單詳情</h2>
                            
                            <div class="order-info">
                                <p><strong>客戶姓名：</strong>${customerName}</p>
                                <p><strong>會員編號：</strong>${memberCode}</p>
                                <p><strong>發送倉庫：</strong>${warehouse}</p>
                                <p><strong>下單時間：</strong>${new Date(
                                  createdAt
                                ).toLocaleString("zh-TW")}</p>
                            </div>
                            
                            <h3>商品明細</h3>
                            <ul class="item-list">
                                ${itemsList}
                            </ul>
                            
                            <div class="total">
                                總金額：NT$ ${totalAmount.toLocaleString()}
                            </div>
                            
                            <a href="${
                              process.env.ADMIN_URL
                            }/orders/${orderId}" class="button">
                                查看訂單詳情
                            </a>
                            
                            <div class="footer">
                                <p>此郵件由系統自動發送，請勿直接回覆</p>
                                <p>© 2025 代購平台 - 您的海外購物專家</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ 新訂單通知已發送: ${orderId}`);
      return { success: true };
    } catch (error) {
      console.error("❌ 郵件發送失敗:", error);
      return { success: false, error: error.message };
    }
  }

  // 發送訂單確認給客戶
  async sendOrderConfirmation(customerEmail, orderData) {
    const {
      orderId,
      customerName,
      memberCode,
      totalAmount,
      items,
      warehouse,
      warehouseAddress,
      estimatedDelivery,
    } = orderData;

    const itemsList = items
      .map(
        (item) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <img src="${item.image}" alt="${
          item.title
        }" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${
                  item.title
                }</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
                  item.quantity
                }</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">NT$ ${(
                  item.price * item.quantity
                ).toLocaleString()}</td>
            </tr>
        `
      )
      .join("");

    const msg = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `訂單確認 #${orderId} - 代購平台`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(90deg, #EE4D2D, #FB6445); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        .success-icon { font-size: 48px; margin-bottom: 20px; }
                        .order-number { background: rgba(255,255,255,0.2); display: inline-block; padding: 10px 20px; border-radius: 25px; margin-top: 10px; }
                        .section { margin: 30px 0; }
                        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #EE4D2D; }
                        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        .warehouse-info { background: #FFF4EC; border: 1px solid #FFD4A3; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .button { display: inline-block; padding: 15px 40px; background: #EE4D2D; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; }
                        .steps { display: flex; justify-content: space-between; margin: 30px 0; }
                        .step { text-align: center; flex: 1; }
                        .step-icon { width: 40px; height: 40px; background: #EE4D2D; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="success-icon">✓</div>
                            <h1 style="margin: 0;">訂單確認成功！</h1>
                            <div class="order-number">訂單編號：${orderId}</div>
                        </div>
                        
                        <div class="content">
                            <div class="section">
                                <h2 style="color: #333;">親愛的 ${customerName}，</h2>
                                <p>感謝您的訂購！我們已收到您的訂單，商品將在確認付款後進行採購。</p>
                            </div>
                            
                            <div class="section">
                                <h3>訂單進度</h3>
                                <div class="steps">
                                    <div class="step">
                                        <div class="step-icon">1</div>
                                        <div>訂單確認</div>
                                    </div>
                                    <div class="step">
                                        <div class="step-icon" style="background: #ccc;">2</div>
                                        <div>等待付款</div>
                                    </div>
                                    <div class="step">
                                        <div class="step-icon" style="background: #ccc;">3</div>
                                        <div>商品採購</div>
                                    </div>
                                    <div class="step">
                                        <div class="step-icon" style="background: #ccc;">4</div>
                                        <div>發往倉庫</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <h3>商品明細</h3>
                                <table class="table">
                                    ${itemsList}
                                    <tr>
                                        <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold;">總計：</td>
                                        <td style="padding: 15px; text-align: right; font-weight: bold; color: #EE4D2D; font-size: 18px;">
                                            NT$ ${totalAmount.toLocaleString()}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div class="warehouse-info">
                                <h3 style="margin-top: 0;">📦 集運倉庫資訊</h3>
                                <p><strong>倉庫：</strong>${warehouse}</p>
                                <p><strong>收件人：</strong>${customerName}-${memberCode}</p>
                                <p><strong>地址：</strong>${warehouseAddress}</p>
                                <p><strong>預計到倉時間：</strong>${estimatedDelivery}</p>
                            </div>
                            
                            <div class="section info-box">
                                <h3 style="margin-top: 0;">💳 付款資訊</h3>
                                <p>請於 24 小時內完成轉帳，並上傳付款證明：</p>
                                <p><strong>銀行：</strong>台灣銀行（004）</p>
                                <p><strong>帳號：</strong>123-456-789012</p>
                                <p><strong>戶名：</strong>代購平台有限公司</p>
                                <p><strong>金額：</strong>NT$ ${totalAmount.toLocaleString()}</p>
                            </div>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${
                                  process.env.SITE_URL
                                }/order-tracking.html?id=${orderId}" class="button">
                                    查看訂單狀態
                                </a>
                            </div>
                            
                            <div class="section" style="background: #f0f8ff; padding: 20px; border-radius: 8px;">
                                <h4 style="margin-top: 0;">📞 需要協助嗎？</h4>
                                <p>客服信箱：service@daigou-platform.com</p>
                                <p>客服時間：週一至週五 09:00-18:00</p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>此郵件由系統自動發送，請勿直接回覆</p>
                            <p>© 2025 代購平台 - 您的海外購物專家</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ 訂單確認郵件已發送給: ${customerEmail}`);
      return { success: true };
    } catch (error) {
      console.error("❌ 郵件發送失敗:", error);
      return { success: false, error: error.message };
    }
  }

  // 發送付款確認通知
  async sendPaymentConfirmation(customerEmail, paymentData) {
    const { orderId, amount, paymentMethod } = paymentData;

    const msg = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `付款確認 - 訂單 #${orderId}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #EE4D2D;">付款確認成功！</h2>
                    <p>我們已收到您的付款 NT$ ${amount.toLocaleString()}</p>
                    <p>訂單編號：${orderId}</p>
                    <p>付款方式：${paymentMethod}</p>
                    <p>我們將立即開始處理您的訂單，預計 1-2 個工作天內完成採購。</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">此郵件由系統自動發送</p>
                </div>
            `,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error("郵件發送失敗:", error);
      return { success: false, error: error.message };
    }
  }

  // 發送發貨通知
  async sendShippingNotification(customerEmail, shippingData) {
    const { orderId, trackingNumber, warehouse, estimatedArrival } =
      shippingData;

    const msg = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `發貨通知 - 訂單 #${orderId}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #EE4D2D;">您的商品已發貨！</h2>
                    <p>訂單編號：${orderId}</p>
                    <p>物流單號：${trackingNumber}</p>
                    <p>發往倉庫：${warehouse}</p>
                    <p>預計到達：${estimatedArrival}</p>
                    <p>您可以使用物流單號追蹤包裹狀態。</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">此郵件由系統自動發送</p>
                </div>
            `,
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error("郵件發送失敗:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
