const admin = require('firebase-admin');

let serviceAccount;

// 根據環境變數讀取 Firebase 服務帳號
try {
  if (process.env.FIREBASE_CONFIG) {
    // 如果環境變數中直接提供了 JSON 字符串
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  } else if (process.env.FIREBASE_CONFIG_BASE64) {
    // 如果環境變數中提供了 Base64 編碼的 JSON 字符串（推薦用於 Railway）
    const decodedConfig = Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decodedConfig);
  } else if (process.env.FIREBASE_CONFIG_PATH) {
    // 如果環境變數中提供了文件路徑
    serviceAccount = require(process.env.FIREBASE_CONFIG_PATH);
  } else {
    // 默認路徑
    serviceAccount = require('../../firebase-service-account.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
  console.warn('Push notification service may not be available');
}

module.exports = admin;
