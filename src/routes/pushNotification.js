const express = require('express');
const {
  sendNotification,
  sendNotificationToMany,
  sendTopicNotification,
  subscribeTopic,
  unsubscribeTopic,
} = require('../controllers/pushNotificationController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// 所有推送通知路由都需要身份驗證
router.use(verifyToken);

/**
 * 發送推送通知給單一裝置
 * POST /api/push-notifications/send
 * Body: {
 *   deviceToken: string,
 *   notification: { title: string, body: string, icon?: string, image?: string },
 *   data?: { key: string }
 * }
 */
router.post('/send', sendNotification);

/**
 * 發送推送通知給多個裝置
 * POST /api/push-notifications/send-many
 * Body: {
 *   deviceTokens: string[],
 *   notification: { title: string, body: string, icon?: string, image?: string },
 *   data?: { key: string }
 * }
 */
router.post('/send-many', sendNotificationToMany);

/**
 * 發送推送通知到主題
 * POST /api/push-notifications/send-topic
 * Body: {
 *   topic: string,
 *   notification: { title: string, body: string, icon?: string, image?: string },
 *   data?: { key: string }
 * }
 */
router.post('/send-topic', sendTopicNotification);

/**
 * 訂閱裝置到主題
 * POST /api/push-notifications/subscribe
 * Body: {
 *   deviceTokens: string[],
 *   topic: string
 * }
 */
router.post('/subscribe', subscribeTopic);

/**
 * 取消訂閱主題
 * POST /api/push-notifications/unsubscribe
 * Body: {
 *   deviceTokens: string[],
 *   topic: string
 * }
 */
router.post('/unsubscribe', unsubscribeTopic);

module.exports = router;
