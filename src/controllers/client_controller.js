const { router } = require('../app');
const clientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const mongoose = require('mongoose');
const MutualFundMember = require('../models/mutual_fund');

const AddClient = async (req, res) => {
    try{
        const investor_uid = req.investor.investor_uid;
        const {  arn_number, user_details, bank_details, fatca_detials , client_desk_settings, upload_documents } = req.body;
        if ( !arn_number || !user_details.mobile_number || !user_details.pan_number || !user_details.date_of_birth || !user_details.email ) {
            return res.status(400).json({ message: 'Please provide all data.' });
        }
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }
        const phone = user_details.mobile_number;
        const phoneExist = await clientSchema.findOne({ 'user_details.mobile_number': phone });
        if (phoneExist) {
          return res.status(400).json({ message: 'This phone number is already used by other client.' });
          }

        const emailId = user_details.email;
        const emailExist = await clientSchema.findOne({ 'user_details.email': emailId });
        if (emailExist) {
          return res.status(400).json({ message: 'This Email Id already used by other client.' });
          }

        const panCard = user_details.pan_number;
        const panExist = await clientSchema.findOne( { 'user_details.pan_number': panCard });

        if (panExist) {
          return res.status(400).json({ message: 'This Pan Card is already used by other client.' });
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

const GetClientInformation = async (req, res) => {
  try {
    const investor_uid = req.investor.investor_uid;
    const clientId = req.params.clientId;
    const data = await InvestorSchema.findOne({investor_uid});
    if (!data) {
      return res.status(404).json({ message: 'InValid Investor.' });
    }
    console.log("data.clients  ---   " +data.clients);
    const clientAvailableInInvestorClients = data.clients.includes(clientId);
    console.log("clientAvailableInInvestorClients  ---   " +clientAvailableInInvestorClients);
    if(clientAvailableInInvestorClients) {
    const clientData = await clientSchema.findById(clientId);
    if (!clientData) {
      return res.status(404).json({ message: 'InValid Client.' });
    }
    return  res.status(200).json({ data: clientData });
    } else {
      return res.status(404).json({ message: 'Client is not available.' });
    }
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}


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

const GetClientMutualFundReport =  async (req, res ) => {
  try {

    const clientId = req.params.clientId;
    const clientData = await clientSchema.findById(clientId);
    if (!clientData) {
      return res.status(404).json({ message: 'InValid Client.' });
    }
    const mutualFundIds = clientData.user_details.mutual_funds;
    const idsArray = Array.isArray(mutualFundIds) ? mutualFundIds : [mutualFundIds];
    const mutualFunds = await MutualFundMember.find({
      _id: { $in: idsArray }
    });
    return  res.status(200).json({
      message: "Mutual funds retrieved successfully!",
      data: mutualFunds
    });
  } catch (error) {
    console.log("error --   "+ error);
    res.status(500).json({ 
      status : false,
      message: "Error Getting mutual fund report",
      error: error.message 
    });
  }
}

const AddClientMutualFundReport = async (req, res) => {

    try {
      const {  investment_since_date, investment_cost, current_value, XIRR, abs_return, today_PnL, total_PnL, investment_list } = req.body;
      const clientId = req.params.clientId;
      const newMutualFundMember = new MutualFundMember({
        investment_since_date,
        investment_cost,
        current_value,
        XIRR,
        abs_return,
        today_PnL,
        total_PnL,
        investment_list
      });
      const savedReport = await newMutualFundMember.save();
      const clientData = await clientSchema.findById(clientId);
      if (!clientData) {
        return res.status(404).json({ message: 'InValid Client.' });
      }
      const mutualFundList = clientData.user_details.mutual_funds;
      mutualFundList.push(savedReport._id);
      clientData.user_details.mutual_funds = mutualFundList;

      console.log("clientData  ----    "+ clientData);

      await clientData.save();
  
      return res.status(201).json({
        message: "Mutual fund report added successfully!",
        data: savedReport
      });
  
    } catch (error) {
      console.log("error --   "+ error);
      res.status(500).json({ 
        message: "Error adding mutual fund report",
        error: error.message 
      });
    }
  }
  
  


module.exports ={ AddClient, ListOfAllClients,   GetClientMFReport, GetClientWealthReport, GetClientInformation, AddClientMutualFundReport, GetClientMutualFundReport}; // AddUserDetails, AddBankDetails, ClientDeskSettings, FatcaDetails,






// const addClientMutualFundData = async (req, res ) => {
//   try{
      
      
//           const clientId = req.body.clientId;
//           const clientData = await clientSchema.findById(clientId);
      
//           if (!clientData) {
//             return res.status(400).json({ error: 'Not valid Client.' });
//           } else {
//             if (!clientData.mutual_funds) {


//               return res.status(400).json({ error: 'No Mutual Fund data Found.' });

//             } else {
//               const mutualFundsList = clientData.mutual_funds;

//               if (!Array.isArray(mutualFundsList) || mutualFundsList.some(id => !mongoose.Types.ObjectId.isValid(id))) {
//                 return res.status(400).json({ error: 'Invalid ID format' });
//               }
             

//               const objectIds = mutualFundsList.map(id => new  mongoose.Types.ObjectId(id));


//               const mutualFunds =  await mutualFund.find({
//                 _id: { $in: objectIds }
//               }).exec();


//               const results = mutualFunds.map(fund => ({
//                 _id: fund._id,
//                 investment_cost: fund.investment_cost.toString(),
//                 current_cost: fund.current_cost.toString(),
//                 absolute_return: fund.absolute_return,
//                 XIRR: fund.XIRR.toString(),
//                 today_PnL: fund.today_PnL.toString(),
//                 total_PnL: fund.total_PnL.toString()
//               }));

    
//               return res.status(201).json({
//                   "mutualFund" : results,
//                 });
//             }
//           }
       

      
//   }catch(err){
//        res.status(400).json({
//           "message" : "Error, Something went wrong."
//       });
//   }
// }
