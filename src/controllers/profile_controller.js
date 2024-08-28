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
          "status" : false,
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
        "status" : true,
          message: 'Notifications retrieved successfully',
          notifications: investor.notifications,
      });


  }catch(err) {
    console.log("error" + err);
      res.status(400).json({
        "status" : false,
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



const WhatsNew = async (req, res) => {
  try{
    const investor_uid = req.investor.investor_uid;
    const investor = await  InvestorSchema.findOne({investor_uid});  
    if (!investor) {
      return res.status(404).json({ "status" : false, message: 'Investor not found' });
    }
    return res.status(200).json({
      "status" : true,
      "data" : [
        {
          "heading" : "We are excited to announce MFU (MF Utility) on our platform.",
          "description" : ["Now you can perform investment of client from MFU directly from AdvisorX App."]
        },
        {
          "heading" : "Send Login Credentials to Client.",
          "description" : ["Now ARN/Subbroker can send login credentials on client's email.", "You can search and select multiple clients and send details on mall."],
        },
        {
          "heading" : "Wealth Multi-Asset Report.",
          "description" : ["We have added Multi-Asset Detail Report in Wealth Reports."]
        },
        {
          "heading" : "Advisor and Sub-Broker Login in AdvisorX App.",
          "description" : ["Now Advisor can provide login to their Subbroker from AdvisorX App."]
        },
      ]
  });

  }catch(err) {
    console.log("error" + err);
      res.status(400).json({
          "status" : false,
          "data" : "Error, Something went wrong."
      });
  }
}

const GetHomeDetails = async (req, res) => {
  try{
    const investor_uid = req.investor.investor_uid;
    const investor = await  InvestorSchema.findOne({investor_uid});  
    if (!investor) {
      return res.status(404).json({ "status" : false, message: 'Investor not found' });
    }
    return res.status(200).json({
      "status" : true,
      "data" : [
        {
          "current_sip" : "2,25,654.05",
          "current_AUM" : "48.79",
          "current_AUM_increment" : "28,30,023",
          "current_AUM_MOM_increment" : "+0.58%",
          "equity" : "51.47%",
          "debt" : "48.53%",
          "cash" : "0%",
          "current_sip" : "0",
          "current_sip_mom_increment" : "0%",
          "last_three_days_purchase" : "0",
          "last_three_days_redemption" : "0",
          "last_three_days_rej_trxns" : "0",
          "last_three_days_new_sip" : "0",
          "one_time_opportunity" : "600000",
          "recurring_opportunity" : "0",

        },
      ]
  });

  } catch(err) {
      console.log("error" + err);
      return res.status(400).json({
          "status" : false,
          "data" : "Error, Something went wrong."
      });
  }
}


module.exports = {GetInvestorProfile, GetNotifications, SendNotification, WhatsNew, GetHomeDetails };