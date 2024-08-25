const clientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const videoKYCSchema = require('../models/investor_video_kyc');


const GetTransactionLog = async (req, res) => {
    
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }

        if (investor.clients.length > 0) {
            const firstClientId = investor.clients[0];
            const client = await clientSchema.findById(firstClientId);
            
            if (!client) {
                return res.status(404).json({ "status" : false, message: 'Client not found' });
            }
            return res.status(201).json({
              "status" : true,
              "data" : [
                {
                  "client_name" : (client.user_details.first_name ? client.user_details.first_name : "") + " " + (client.user_details.last_name ? client.user_details.last_name : ""),
                  "transaction_date" : "20 August 2024",
                  "folio_no" : "10569084",
                  "name" : "HDFC Flexicap Fund - Growth option",
                  "amount" : "1000",
                  "BSE_client_id": "8787",
                  "member_id" : "11689",
                  "moh":"SI",
                  "message" : "Invalid user name and password"
                },
                {
                    "client_name" : (client.user_details.first_name ? client.user_details.first_name : "") + " " + (client.user_details.last_name ? client.user_details.last_name : ""),
                    "transaction_date" : "12 August 2024",
                    "folio_no" : "91023008102",
                    "name" : "AXIS Liquid Fund -Regular Growth",
                    "amount" : "50000",
                    "BSE_client_id": "8787",
                    "member_id" : "11689",
                    "moh":"SI",
                    "message" : "Invalid user name and password"
                },
                {
                    "client_name" : (client.user_details.first_name ? client.user_details.first_name : "") + " " + (client.user_details.last_name ? client.user_details.last_name : ""),
                    "transaction_date" : "5 July 2024",
                    "folio_no" : "8202527",
                    "name" : "ICICI Pruduntial Multicap Fund - Growth",
                    "amount" : "100000",
                    "BSE_client_id": "8787",
                    "member_id" : "11689",
                    "moh":"SI",
                    "message" : "Invalid user name and password"
                },
              ]
            })
          } else {
              return res.status(404).json({ 
                "status" : false,
                "message": 'No clients found for this investor',
             });
          }


    } catch(err){
            return res.status(500).send({
                message: 'Error, Something went wrong.',
                error: err.message
            });
    }
  }

  

  module.exports = { GetTransactionLog };