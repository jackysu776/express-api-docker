const admin = require('../config/firebase');

/**
 * 發送單個推送通知給特定裝置
 * @param {string} deviceToken - 裝置的 FCM token
 * @param {Object} notification - 通知對象 { title, body, icon?, image? }
 * @param {Object} data - 額外的數據 (可選)
 * @returns {Promise<string>} - 消息 ID
 */
const sendNotificationToDevice = async (deviceToken, notification, data = {}) => {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.icon && { icon: notification.icon }),
        ...(notification.image && { image: notification.image }),
      },
      ...(Object.keys(data).length > 0 && { data }),
      // Android 特定配置
      android: {
        ttl: 86400, // 24 小時
        priority: 'high',
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.icon && { icon: notification.icon }),
          ...(notification.image && { image: notification.image }),
          clickAction: data.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      // iOS 特定配置
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const messageId = await admin.messaging().send(message);
    console.log('Push notification sent successfully:', messageId);
    return messageId;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

/**
 * 發送推送通知給多個裝置
 * @param {Array<string>} deviceTokens - 裝置的 FCM tokens
 * @param {Object} notification - 通知對象
 * @param {Object} data - 額外的數據 (可選)
 * @returns {Promise<Object>} - 包含成功和失敗的結果
 */
const sendNotificationToMultipleDevices = async (deviceTokens, notification, data = {}) => {
  try {
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.icon && { icon: notification.icon }),
        ...(notification.image && { image: notification.image }),
      },
      ...(Object.keys(data).length > 0 && { data }),
      android: {
        ttl: 86400,
        priority: 'high',
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.icon && { icon: notification.icon }),
          ...(notification.image && { image: notification.image }),
          clickAction: data.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      // iOS 特定配置
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            sound: 'default',
            badge: 1,
          },
        },
      },

    console.log(`Successfully sent notifications to ${response.successCount} devices`);
    console.log(`Failed to send to ${response.failureCount} devices`);

    // 返回詳細結果
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses.map((resp, index) => ({
        token: deviceTokens[index],
        success: resp.success,
        messageId: resp.messageId,
        error: resp.error?.message,
      })),
    };
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    throw new Error(`Failed to send notifications: ${error.message}`);
  }
};

/**
 * 發送推送通知給訂閱了特定主題的所有裝置
 * @param {string} topic - 主題名稱
 * @param {Object} notification - 通知對象
 * @param {Object} data - 額外的數據 (可選)
 * @returns {Promise<string>} - 消息 ID
 */
const sendNotificationToTopic = async (topic, notification, data = {}) => {
  try {
    const message = {
      topic,
      notification: {
        title: notification.title,
        body: notification.body,
        ...(notification.icon && { icon: notification.icon }),
        ...(notification.image && { image: notification.image }),
      },
      ...(Object.keys(data).length > 0 && { data }),
      android: {
        ttl: 86400,
        priority: 'high',
        notification: {
          title: notification.title,
          body: notification.body,
          ...(notification.icon && { icon: notification.icon }),
          ...(notification.image && { image: notification.image }),
          clickAction: data.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      // iOS 特定配置
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const messageId = await admin.messaging().send(message);
    console.log('Topic notification sent successfully:', messageId);
    return messageId;
  } catch (error) {
    console.error('Error sending topic notification:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

/**
 * 訂閱裝置到主題
 * @param {Array<string>} deviceTokens - 裝置的 FCM tokens
 * @param {string} topic - 主題名稱
 * @returns {Promise<Object>} - 訂閱結果
 */
const subscribeToTopic = async (deviceTokens, topic) => {
  try {
    const response = await admin.messaging().subscribeToTopic(deviceTokens, topic);
    console.log(`Subscribed ${response.successCount} devices to topic: ${topic}`);
    return response;
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    throw new Error(`Failed to subscribe to topic: ${error.message}`);
  }
};

/**
 * 取消訂閱主題
 * @param {Array<string>} deviceTokens - 裝置的 FCM tokens
 * @param {string} topic - 主題名稱
 * @returns {Promise<Object>} - 取消訂閱結果
 */
const unsubscribeFromTopic = async (deviceTokens, topic) => {
  try {
    const response = await admin.messaging().unsubscribeFromTopic(deviceTokens, topic);
    console.log(`Unsubscribed ${response.successCount} devices from topic: ${topic}`);
    return response;
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    throw new Error(`Failed to unsubscribe from topic: ${error.message}`);
  }
};

module.exports = {
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
  sendNotificationToTopic,
  subscribeToTopic,
  unsubscribeFromTopic,
};
