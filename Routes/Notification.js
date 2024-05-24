// routes/notifications.js

const express = require('express');
const router = express.Router();
const Notification = require('../Models/NotificationSchema');
const authTokenHandler = require('../Middlewares/checkAuthToken');

// Get notifications for a user
router.get('/getnoti', authTokenHandler, async (req, res) => {
  try {
    const userId = req.userId; // Lấy userId từ middleware authTokenHandler

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new notification (for demo/testing purposes)
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({ userId, message });
    await notification.save();
    res.status(201).json({ message: 'Notification created', data: notification });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error });
  }
});

router.put('/update/:id', authTokenHandler, async (req, res) => {
  try {
    const notificationId = req.params.id; 
    const userId = req.userId; // Lấy userId từ middleware authTokenHandler
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' }); // Trả về lỗi nếu không có userId
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId }, // Chỉ cập nhật nếu userId khớp
      { $set: { isRead: true } },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' }); 
    }

    res.status(200).json({ message: 'Notification updated successfully', data: updatedNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
