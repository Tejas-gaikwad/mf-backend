const clientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');


const GetCurrentTransactionLog = async (req, res) => {
    
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }

            const clientId = req.params.clientId;
            const client = await clientSchema.findById(clientId);
            
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
      


    } catch(err){
            return res.status(500).send({
                message: 'Error, Something went wrong.',
                error: err.message
            });
    }
}

const GetFutureTransactionLog = async (req, res) => {
    
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }

            const clientId = req.params.clientId;
            const client = await clientSchema.findById(clientId);
            
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
              
              ]
            })
      


    } catch(err){
            return res.status(500).send({
                message: 'Error, Something went wrong.',
                error: err.message
            });
    }
}

  

  module.exports = { GetCurrentTransactionLog, GetFutureTransactionLog };