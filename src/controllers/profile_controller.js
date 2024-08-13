const UserSchema = require('../models/user');
const Notifications = require('../models/notification');

const GetUserProfile = async (req, res, next) => {
    try{
        const username = req.user.username;
        const user = await  UserSchema.findOne({username});  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });

    }catch(err) {
      console.log("error" + err);
        res.status(400).json({
            "message" : "Error, Something went wrong."
        });
    }
};


const GetNotifications = async (req, res, next) => {
  try{
      const username = req.user.username;
      const user = await UserSchema.findOne({ username }).populate('notifications'); // Populate notifications field
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Return the notifications
      return res.status(200).json({
          message: 'Notifications retrieved successfully',
          notifications: user.notifications,
      });


  }catch(err) {
    console.log("error" + err);
      res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
};


const SendNotification = async (req, res, next) => {

  try{
      const { username, notification_heading, notification_content, notification_date } = req.body;
      console.log("username ---------    "+username);
      const user = await  UserSchema.findOne({username});  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log("user _id ---------    "+user._id);


      const newNotification = new Notifications({
        
        notification_heading,
        notification_content,
        notification_date: new Date(notification_date), // Ensure date is in Date format
      });

      const savedNotification = await newNotification.save();

      await UserSchema.findByIdAndUpdate(
        user._id,
        { $push: { notifications: savedNotification._id } }, // Add notification ID to the notifications array
        { new: true } // Return the updated document
      );  


      res.status(201).json({
        message: 'Notification added successfully',
        notification: savedNotification,
    });

  }catch(err) {
    console.log("error" + err);
      res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
};

module.exports = {GetUserProfile, GetNotifications, SendNotification };