const InvestorSchema = require('../models/investor');
const Notifications = require('../models/notification');

const GetInvestorProfile = async (req, res, next) => {
    try{
        const investor_uid = req.investor.investor_uid;
        console.log("investor_uid ---------    "+investor_uid);
        const investor = await  InvestorSchema.findOne({investor_uid});  
        if (!investor) {
          return res.status(404).json({ message: 'investor not found' });
        }
        res.status(200).json({ investor });

    }catch(err) {
      console.log("error" + err);
        res.status(400).json({
            "message" : "Error, Something went wrong."
        });
    }
};


const GetNotifications = async (req, res, next) => {
  try{
      const investor_uid = req.investor.investor_uid;
      console.log("investor_uid ---------    "+investor_uid);

      const investor = await InvestorSchema.findOne({ investor_uid }).populate('notifications'); // Populate notifications field

      if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
      }

      // Return the notifications
      return res.status(200).json({
          message: 'Notifications retrieved successfully',
          notifications: investor.notifications,
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
      const { investor_uid, notification_heading, notification_content, notification_date } = req.body;
      console.log("investor_uid ---------    "+investor_uid);
      const investor = await  InvestorSchema.findOne({investor_uid});  
      if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
      }

      console.log("investor _id ---------    "+investor._id);


      const newNotification = new Notifications({
        
        notification_heading,
        notification_content,
        notification_date: new Date(notification_date), // Ensure date is in Date format
      });

      const savedNotification = await newNotification.save();

      await InvestorSchema.findByIdAndUpdate(
        investor._id,
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

module.exports = {GetInvestorProfile, GetNotifications, SendNotification };