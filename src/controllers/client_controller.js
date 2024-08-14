const { router } = require('../app');
const clientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const mongoose = require('mongoose');
const mutualFund = require('../models/mutual_fund');

const AddClient = async (req, res) => {
    try{
        const investor_uid = req.investor.investor_uid;
        const {  arn_number, user_details, bank_details, fatca_detials , client_desk_settings, upload_documents } = req.body;
        if ( !arn_number || !user_details || !bank_details || !fatca_detials || !client_desk_settings || !upload_documents ) {
            return res.status(400).json({ message: 'Please provide all data.' });
        }
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }
        const phone = user_details.mobile_number;
        const existingClient = await clientSchema.findOne({ 'user_details.mobile_number':  phone });
        if (existingClient) {
        return res.status(400).json({ message: 'This phone number is already used by other client.' });
        }
        const client = new clientSchema({ investor_uid, arn_number, user_details, bank_details, fatca_detials, client_desk_settings, upload_documents }); // arn_number,
        const savedClient = await client.save();
        if (!investor.clients) {
          investor.clients = [];
        }
        investor.clients.push(savedClient._id);
        await investor.save();
        res.status(201).json({ message: 'Client added successfully', client: savedClient });

    } catch(err){
        console.log("err --   ", err);
        res.status(400).json({
            "message" : "Error, Something went wrong."
        });
    }
}

const ListOfAllClients = async (req, res) => {
    try {
      const investor_uid = req.investor.investor_uid;

      const data = await InvestorSchema.findOne({investor_uid}).populate('clients').exec();
      if (!data) {
        return res.status(404).json({ message: 'Investor not found' });
      }
      res.status(200).json({ clients: data.clients });
    } catch (error) {
      console.error('Error getting clients:', error);
      res.status(500).json({ message: 'Failed to get clients' });
    }
}

// const FatcaDetails = async (req, res) => {
//   try{
//       // const { bith_place, birth_country, wealth_source, politically_exposed_person, address_type, residence_country, income_slab } = req.body;
//       const newFatcaDetails = req.body;
//       const { clientId } = req.params;

//       if (!newFatcaDetails) {
//           return res.status(400).json({ message: 'Please provide all details' });
//       }

//       const client = await clientSchema.findByIdAndUpdate( clientId );
//       if (!client) {
//         return res.status(400).json({ message: 'Client not found.'});
//       }

//       if (!client.fatca_detials) {
//         client.fatca_detials = newFatcaDetails;
//         await client.save();
//         return res.status(400).json({ message: 'Fatca details added successfully', client: client });
//       }

//       client.fatca_detials = {
//         ...client.fatca_detials.toObject(),  
//         ...newFatcaDetails,  
//       };

//       await client.save();

//       return res.status(201).json({ message: 'Fatca details added successfully', client: client });

//   } catch(err){
//       console.log("err --   ", err);
//       res.status(400).json({
//           "message" : "Error, Something went wrong."
//       });
//   }
// }

// const AddClientUserDetails = async (req, res) => {
//   try{
//     const newClientUserDetails = req.body;
//     const { clientId } = req.params;

//     if (!newClientUserDetails) {
//         return res.status(400).json({ message: 'Please provide all details' });
//     }

//     const client = await clientSchema.findByIdAndUpdate( clientId );
//     if (!client) {
//       return res.status(400).json({ message: 'Client not found.'});
//     }

//     if (!client.user_details) {
//       client.user_details = newClientUserDetails;
//       await client.save();
//       return res.status(400).json({ message: 'User details added successfully', client: client });
//     }

//     client.user_details = {
//       ...client.user_details.toObject(),  
//       ...newClientUserDetails,  
//     };

//     await client.save();

//     return res.status(201).json({ message: 'User details updated successfully', client: client });

//   } catch(err) {
//       console.log("err --   ", err);
//       res.status(400).json({
//           "message" : "Error, Something went wrong."
//       });
//   }
// }

// const AddBankDetails = async (req, res) => {
//   try{
    
//     const newBankDetails = req.body;
//     const { clientId } = req.params;

//     if (!newBankDetails) {
//         return res.status(400).json({ message: 'Please provide all details' });
//     }

//     const client = await clientSchema.findByIdAndUpdate( clientId );
//     if (!client) {
//       return res.status(400).json({ message: 'Client not found.'});
//     }

//     if (!client.bank_details) {
//       client.bank_details = newBankDetails;
//       await client.save();
//       return res.status(400).json({ message: 'Bank details added successfully', client: client });
//     }

//     client.bank_details = {
//       ...client.bank_details.toObject(),  
//       ...newBankDetails,  
//     };

//     await client.save();

//     return res.status(201).json({ message: 'Bank details updated successfully', client: client });


//   } catch(err){
//       console.log("err --   ", err);
//       res.status(400).json({
//           "message" : "Error, Something went wrong."
//       });
//   }
// }

// const ClientDeskSettings = async (req, res) => {
//   try{
//       const clientDeskSettings = req.body;
//       const { clientId } = req.params;

//       if (!clientDeskSettings) {
//           return res.status(400).json({ message: 'Please provide all details' });
//       }

//       const client = await clientSchema.findById( clientId );

//       if (!client) {
//         return res.status(400).json({ message: 'Client not found.'});
//       }

//       client.client_desk_settings = clientDeskSettings;
//       await client.save();

//       res.status(201).json({ message: 'Client Desk Settings updated successfully', client: client });

//   } catch(err){
//       console.log("err --   ", err);
//       res.status(400).json({
//           "message" : "Error, Something went wrong."
//       });
//   }
// }

// const submitBSERegistration = async (req, res) => {
//   // TODO add logic here to make submission 
// }

// const sendClientLoginCredentials = async (req, res) => {
//   // TODO add logic here to make submission 
// }

const GetClientMFReport = async (req, res ) => {
  try{

        const clientId = req.body.clientId;
        const report_type = req.body.reportType;

        if(report_type == "mutual_fund") {
          const clientData = await clientSchema.findById(clientId);
  
          if (!clientData) {
            return res.status(400).json({ error: 'Not valid Client.' });
          } else {
            if (!clientData.mutual_funds) {
              return res.status(400).json({ error: 'No Mutual Fund data Found.' });

            } else {
              const mutualFundsList = clientData.mutual_funds;
              if (!Array.isArray(mutualFundsList) || mutualFundsList.some(id => !mongoose.Types.ObjectId.isValid(id))) {
                return res.status(400).json({ error: 'Invalid ID format' });
              }
              const objectIds = mutualFundsList.map(id => new  mongoose.Types.ObjectId(id));
              const mutualFunds =  await mutualFund.find({
                _id: { $in: objectIds }
              }).exec();
              const results = mutualFunds.map(fund => ({
                _id: fund._id,
                investment_cost: fund.investment_cost.toString(),
                current_cost: fund.current_cost.toString(),
                absolute_return: fund.absolute_return,
                XIRR: fund.XIRR.toString(),
                today_PnL: fund.today_PnL.toString(),
                total_PnL: fund.total_PnL.toString()
              }));

    
              return res.status(201).json({
                  "mutualFund" : results,
                });
            }
          }
        }

      
  }catch(err){
       res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}

const addClientMutualFundData = async (req, res ) => {
  try{
      
      
          const clientId = req.body.clientId;
          const clientData = await clientSchema.findById(clientId);
      
          if (!clientData) {
            return res.status(400).json({ error: 'Not valid Client.' });
          } else {
            if (!clientData.mutual_funds) {


              return res.status(400).json({ error: 'No Mutual Fund data Found.' });

            } else {
              const mutualFundsList = clientData.mutual_funds;

              if (!Array.isArray(mutualFundsList) || mutualFundsList.some(id => !mongoose.Types.ObjectId.isValid(id))) {
                return res.status(400).json({ error: 'Invalid ID format' });
              }
             

              const objectIds = mutualFundsList.map(id => new  mongoose.Types.ObjectId(id));


              const mutualFunds =  await mutualFund.find({
                _id: { $in: objectIds }
              }).exec();


              const results = mutualFunds.map(fund => ({
                _id: fund._id,
                investment_cost: fund.investment_cost.toString(),
                current_cost: fund.current_cost.toString(),
                absolute_return: fund.absolute_return,
                XIRR: fund.XIRR.toString(),
                today_PnL: fund.today_PnL.toString(),
                total_PnL: fund.total_PnL.toString()
              }));

    
              return res.status(201).json({
                  "mutualFund" : results,
                });
            }
          }
       

      
  }catch(err){
       res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}





const GetClientWealthReport = async (req, res ) => {
  try{
      const investor_uid = req.investor.investor_uid;


      if(investor_uid){

        const clientId = req.body.clientId;
        const report_type = req.body.reportType;

        
        if(report_type == "wealth") {
          const clientData = await clientSchema.findById(clientId);
          
          if (!clientData) {
            return res.status(400).json({ error: 'Not valid Client.' });
          } else {
            if (!clientData.wealth_report) {
              return res.status(400).json({ error: 'No Mutual Fund data Found.' });
            } else {
              const wealthReport = clientData.wealth_report;
              if (!Array.isArray(mutualFundsList) || mutualFundsList.some(id => !mongoose.Types.ObjectId.isValid(id))) {
                return res.status(400).json({ error: 'Invalid ID format' });
              }
              const objectIds = mutualFundsList.map(id => new  mongoose.Types.ObjectId(id));
              return res.status(201).json({
                  "mutualFund" : results,
                });
            }
          }
        }

      } else{
          res.status(400).json({
              "message" : "Invalid Authentication."
          }); 
      }
  }catch(err){
      console.log("error" + err);
       res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}

const getMutualFundReportFromDatabase = async ( clientId) => {

}


module.exports ={ AddClient, ListOfAllClients,   GetClientMFReport, GetClientWealthReport}; // AddUserDetails, AddBankDetails, ClientDeskSettings, FatcaDetails,