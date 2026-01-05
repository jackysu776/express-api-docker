# Firebase 推送通知功能文檔

## 功能概述

這個 API 提供了完整的 Firebase Cloud Messaging (FCM) 集成，支持以下功能：

- ✅ 發送推送通知給單一裝置
- ✅ 批量發送推送通知給多個裝置
- ✅ 發送推送通知到特定主題
- ✅ 訂閱/取消訂閱裝置到主題
- ✅ 支援 Android 和 iOS 平台特定配置

## 安裝與配置

### 1. 安裝依賴

```bash
npm install
```

### 2. Firebase 配置

#### 方式 A: 使用環境變數（推薦用於容器環境）

在 `.env` 文件中設置 `FIREBASE_CONFIG`：

```bash
# 將整個 Firebase 服務帳號 JSON 作為字符串傳遞
FIREBASE_CONFIG='{"type":"service_account","project_id":"your-project","private_key":"...","client_email":"..."}'
```

#### 方式 B: 使用配置文件

1. 從 Firebase 控制台下載服務帳號 JSON 文件
2. 將其放置在項目根目錄，命名為 `firebase-service-account.json`
3. 在 `.env` 文件中設置：

```bash
FIREBASE_CONFIG_PATH=./firebase-service-account.json
```

### 3. Docker 配置

在 `docker-compose.yml` 中設置環境變數：

```yaml
environment:
  - FIREBASE_CONFIG=${FIREBASE_CONFIG}
  # 或
  - FIREBASE_CONFIG_PATH=/app/firebase-service-account.json
```

## API 端點

所有端點都需要通過身份驗證（需要有效的認證令牌）。

### 1. 發送推送通知給單一裝置

**POST** `/api/push-notifications/send`

請求體：
```json
{
  "deviceToken": "device_fcm_token",
  "notification": {
    "title": "通知標題",
    "body": "通知內容",
    "icon": "optional_icon_url",
    "image": "optional_image_url"
  },
  "data": {
    "action": "open_app",
    "userId": "123"
  }
}
```

回應：
```json
{
  "message": "Notification sent successfully",
  "messageId": "message_id_string"
}
```

### 2. 批量發送推送通知

**POST** `/api/push-notifications/send-many`

請求體：
```json
{
  "deviceTokens": ["token1", "token2", "token3"],
  "notification": {
    "title": "通知標題",
    "body": "通知內容"
  },
  "data": {
    "action": "open_app"
  }
}
```

回應：
```json
{
  "message": "Notifications processed",
  "successCount": 2,
  "failureCount": 1,
  "responses": [
    {
      "token": "token1",
      "success": true,
      "messageId": "message_id"
    },
    {
      "token": "token2",
      "success": false,
      "error": "Invalid registration token"
    }
  ]
}
```

### 3. 發送推送通知到主題

**POST** `/api/push-notifications/send-topic`

請求體：
```json
{
  "topic": "news",
  "notification": {
    "title": "新聞通知",
    "body": "有新聞發布了"
  },
  "data": {
    "newsId": "123"
  }
}
```

回應：
```json
{
  "message": "Topic notification sent successfully",
  "messageId": "message_id_string"
}
```

### 4. 訂閱裝置到主題

**POST** `/api/push-notifications/subscribe`

請求體：
```json
{
  "deviceTokens": ["token1", "token2"],
  "topic": "news"
}
```

回應：
```json
{
  "message": "Successfully subscribed to topic: news",
  "successCount": 2,
  "failureCount": 0
}
```

### 5. 取消訂閱主題

**POST** `/api/push-notifications/unsubscribe`

請求體：
```json
{
  "deviceTokens": ["token1", "token2"],
  "topic": "news"
}
```

回應：
```json
{
  "message": "Successfully unsubscribed from topic: news",
  "successCount": 2,
  "failureCount": 0
}
```

## 使用示例

### cURL 示例

```bash
# 需要有效的認證令牌
TOKEN="your_jwt_token"

# 發送單一推送通知
curl -X POST http://localhost:3000/api/push-notifications/send \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "your_device_token",
    "notification": {
      "title": "Hello",
      "body": "This is a test notification"
    }
  }'

# 發送主題通知
curl -X POST http://localhost:3000/api/push-notifications/send-topic \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "news",
    "notification": {
      "title": "New Article",
      "body": "Check out our latest article"
    }
  }'
```

## 最佳實踐

1. **安全性**：
   - 所有推送通知端點都需要認證
   - 驗證 deviceToken 的格式
   - 限制每個用戶的通知發送頻率

2. **效能**：
   - 使用 `send-many` 批量發送通知，而不是多次調用 `send`
   - 使用主題功能進行大規模廣播通知
   - 考慮使用隊列系統處理高量的通知請求

3. **錯誤處理**：
   - 監控 `failureCount` 並記錄失敗的 token
   - 定期清理已失效的 device tokens
   - 實現重試機制

4. **平台特定配置**：
   - Android 支持自定義聲音和優先級設置
   - iOS 支持徽章和聲音配置
   - 兩個平台都支持自定義數據

## 故障排除

### Firebase 初始化失敗

檢查以下事項：
1. 確保 `FIREBASE_CONFIG` 或 `FIREBASE_CONFIG_PATH` 正確配置
2. 驗證服務帳號 JSON 文件內容
3. 檢查環境變數是否正確設置

### 發送通知失敗

- 驗證 deviceToken 格式是否正確
- 確保 deviceToken 有效且未過期
- 檢查 Firebase 項目配置中是否啟用了 Cloud Messaging

### 無法訂閱主題

- 驗證主題名稱只包含字母、數字、破折號和下劃線
- 確保 deviceTokens 格式正確

## 文件結構

```
src/
├── config/
│   └── firebase.js              # Firebase Admin SDK 初始化
├── services/
│   └── pushNotificationService.js  # 推送通知業務邏輯
├── controllers/
│   └── pushNotificationController.js # API 控制器
└── routes/
    └── pushNotification.js      # 推送通知路由
```

## 環境變數

| 變數名 | 說明 | 示例 |
|--------|------|------|
| `FIREBASE_CONFIG` | Firebase 服務帳號 JSON (字符串格式) | `{...json...}` |
| `FIREBASE_CONFIG_PATH` | Firebase 服務帳號文件路徑 | `./firebase-service-account.json` |
| `PORT` | 伺服器端口 | `3000` |
| `NODE_ENV` | 運行環境 | `development` `production` |

## 相關資源

- [Firebase Cloud Messaging 文檔](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK 文檔](https://firebase.google.com/docs/admin/setup)
- [FCM 概念和選項](https://firebase.google.com/docs/cloud-messaging/concept-options)
