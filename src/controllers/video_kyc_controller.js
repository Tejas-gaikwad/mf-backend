const clientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const videoKYCSchema = require('../models/investor_video_kyc');


const updateClientVideoKycData = async (req, res) => {
    
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});

        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }

        const { user_details, identity, address, correspondenceAddress, forms, fatca_details, signature, photo, video, } = req.body;
    
        const investorVideoKYCData = new videoKYCSchema({ investor_uid,  user_details, identity, address, correspondenceAddress, forms, fatca_details, signature, signature, photo, video,});
        const savedData = await investorVideoKYCData.save();
        investor.client_video_kyc__data_uid =  savedData._id;
        const updatedInvestor = await investor.save();
        if (!updatedInvestor) {
            return res.status(404).json({  "status" : false, message: 'Cannot update data' });
        }

        return res.status(201).json({
          "status" : true,
          "message" : "Video KYC done.",
          "data" : savedData
        });

    } catch(err){
        if (err.code === 11000) { 
            return res.status(400).send({
                message: 'Duplicate key error: This email already exists.',
                field: err.keyValue 
            });
        } else {
            return res.status(500).send({
                message: 'An error occurred while adding the investor.',
                error: err.message
            });
        }
    }
  }

  module.exports = { updateClientVideoKycData };