const clientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const videoKYCSchema = require('../models/client_video_kyc');


const updateClientVideoKycData = async (req, res) => {
    
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});

        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }

        const { arn_number, user_details, identity, address, correspondenceSchema, forms, fatca_details, signature, photo, video, } = req.body;
       
        const clientId = req.params.clientId;
        const clientData = await clientSchema.findById(clientId);
        if (!clientData) {
            return res.status(404).json({  "status" : false, message: 'Client not found' });
        }

        const clientVideoKYCData = new videoKYCSchema({ investor_uid, arn_number, user_details, identity, address, correspondenceSchema, forms, fatca_details, signature, signature, photo, video,});
        const savedClientData = await clientVideoKYCData.save();
        clientData.client_video_kyc__data_uid =  savedClientData._id;
        const updatedClient = await clientData.save();
        if (!updatedClient) {
            return res.status(404).json({  "status" : false, message: 'Cannot update client' });
        }
        return res.status(201).json({
          "status" : true,
          "message" : "Video KYC done.",
          "data" : savedClientData
        });
    } catch(err){
        console.log("err --   ", err);
        res.status(400).json({
          "status" : false,
            "message" : "Error, Something went wrong."
        });
    }
  
  }

  module.exports = { updateClientVideoKycData };