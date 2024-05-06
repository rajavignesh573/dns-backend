const notificationcontroller = {};
const Notification = require('../models/notificationmodel');

notificationcontroller.getNotifications = async (req, res) => {
    const notifications = await Notification.find();
    res.json(notifications);
}

module.exports = notificationcontroller