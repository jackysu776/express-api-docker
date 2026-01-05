const {
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
  sendNotificationToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
} = require('../services/pushNotificationService');

/**
 * 發送推送通知給單一裝置
 */
const sendNotification = async (req, res) => {
  try {
    const { deviceToken, notification, data } = req.body;

    // 驗證必需的字段
    if (!deviceToken) {
      return res.status(400).json({ message: 'deviceToken is required' });
    }

    if (!notification || !notification.title || !notification.body) {
      return res.status(400).json({
        message: 'notification object with title and body is required',
      });
    }

    const messageId = await sendNotificationToDevice(deviceToken, notification, data);

    res.status(200).json({
      message: 'Notification sent successfully',
      messageId,
    });
  } catch (error) {
    console.error('Error in sendNotification:', error);
    res.status(500).json({
      message: 'Failed to send notification',
      error: error.message,
    });
  }
};

/**
 * 發送推送通知給多個裝置
 */
const sendNotificationToMany = async (req, res) => {
  try {
    const { deviceTokens, notification, data } = req.body;

    // 驗證必需的字段
    if (!deviceTokens || !Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      return res.status(400).json({ message: 'deviceTokens array is required' });
    }

    if (!notification || !notification.title || !notification.body) {
      return res.status(400).json({
        message: 'notification object with title and body is required',
      });
    }

    const result = await sendNotificationToMultipleDevices(deviceTokens, notification, data);

    res.status(200).json({
      message: 'Notifications processed',
      ...result,
    });
  } catch (error) {
    console.error('Error in sendNotificationToMany:', error);
    res.status(500).json({
      message: 'Failed to send notifications',
      error: error.message,
    });
  }
};

/**
 * 發送推送通知到主題
 */
const sendTopicNotification = async (req, res) => {
  try {
    const { topic, notification, data } = req.body;

    // 驗證必需的字段
    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    if (!notification || !notification.title || !notification.body) {
      return res.status(400).json({
        message: 'notification object with title and body is required',
      });
    }

    const messageId = await sendNotificationToTopic(topic, notification, data);

    res.status(200).json({
      message: 'Topic notification sent successfully',
      messageId,
    });
  } catch (error) {
    console.error('Error in sendTopicNotification:', error);
    res.status(500).json({
      message: 'Failed to send topic notification',
      error: error.message,
    });
  }
};

/**
 * 訂閱裝置到主題
 */
const subscribeTopic = async (req, res) => {
  try {
    const { deviceTokens, topic } = req.body;

    // 驗證必需的字段
    if (!deviceTokens || !Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      return res.status(400).json({ message: 'deviceTokens array is required' });
    }

    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const result = await subscribeToTopic(deviceTokens, topic);

    res.status(200).json({
      message: `Successfully subscribed to topic: ${topic}`,
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    console.error('Error in subscribeTopic:', error);
    res.status(500).json({
      message: 'Failed to subscribe to topic',
      error: error.message,
    });
  }
};

/**
 * 取消訂閱主題
 */
const unsubscribeTopic = async (req, res) => {
  try {
    const { deviceTokens, topic } = req.body;

    // 驗證必需的字段
    if (!deviceTokens || !Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      return res.status(400).json({ message: 'deviceTokens array is required' });
    }

    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const result = await unsubscribeFromTopic(deviceTokens, topic);

    res.status(200).json({
      message: `Successfully unsubscribed from topic: ${topic}`,
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    console.error('Error in unsubscribeTopic:', error);
    res.status(500).json({
      message: 'Failed to unsubscribe from topic',
      error: error.message,
    });
  }
};

module.exports = {
  sendNotification,
  sendNotificationToMany,
  sendTopicNotification,
  subscribeTopic,
  unsubscribeTopic,
};
