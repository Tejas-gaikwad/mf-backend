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

const updateClientData = async (req, res) => {

  try{
      const investor_uid = req.investor.investor_uid;
      const investor = await InvestorSchema.findOne({investor_uid});
      if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
      }
      const updateData = req.body;
      const clientId = req.params.clientId;
      const clientData = await clientSchema.findById(clientId);
      if (!clientData) {
          return res.status(404).json({  "status" : false, message: 'Client not found' });
      }

      if(clientData.user_details.pan_number !== updateData.user_details.pan_number) {
        return res.status(400).json({ "status" : false, message: 'Cannot change Pan card number.' });
      }

      if(clientData.user_details.email !== updateData.user_details.email) {
        return res.status(400).json({ "status" : false, message: 'Cannot change Email.' });
      }
      if(clientData.user_details.mobile_number !== updateData.user_details.mobile_number) {
        return res.status(400).json({ "status" : false, message: 'Cannot  Phone number.' });
      }  
      const updatedClient = await clientSchema.findByIdAndUpdate(clientId, { $set: updateData }, { new: true });
      if (!updatedClient) {
          return res.status(404).json({  "status" : false, message: 'Cannot update client' });
      }
      return res.status(201).json({
        "status" : true,
        "data" : updatedClient
      });
  } catch(err){
      console.log("err --   ", err);
      res.status(400).json({
        "status" : false,
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
          console.log("clientData   ----    "+ clientData);  
          if (!clientData) {
            return res.status(400).json({ error: 'Not valid Client.' });
          } else {
            if (!clientData.user_details.mutual_funds) {
              return res.status(400).json({ error: 'No Mutual Fund data Found.' });

            } else {
              const mutualFundsList = clientData.user_details.mutual_funds;

              if (!Array.isArray(mutualFundsList) || mutualFundsList.some(id => !mongoose.Types.ObjectId.isValid(id))) {
                return res.status(400).json({ error: 'Invalid ID format' });
              }
              const objectIds = mutualFundsList.map(id => new  mongoose.Types.ObjectId(id));
              const mutualFunds =  await MutualFundMember.find({
                _id: { $in: objectIds }
              }).exec();
              const results = mutualFunds.map(fund => ({
                _id: fund._id,
                investment_cost: fund.investment_cost,
                current_cost: fund.current_cost,
                absolute_return: fund.absolute_return,
                XIRR: fund.XIRR,
                today_PnL: fund.today_PnL,
                total_PnL: fund.total_PnL
              }));

    
              return res.status(201).json({
                  "mutualFund" : results,
                });
            }
          }
        }

      
  }catch(err){
    console.log("error   ----    "+ err);  

       res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}


const GetClientWealthReport = async (req, res ) => {
  try{
        const clientId = req.params.clientId;
        if(!clientId) {
          return res.status(400).json({ "status" : false,  error: 'Invalid Client Id.' });
        }
          const clientData = await clientSchema.findById(clientId);
          console.log("clientData   ----    "+ clientData);  
          if (!clientData) {
            return res.status(400).json({ "status" : false, error: 'Not valid Client.' });
          } else {
        
            return res.status(201).json({
                  "status" : true,
                  "wealth_report" : {
                    "investment_portfolio_total" : {
                    "total_investment": "86,85,26,887",
                    "current_value" :  "4,86,85,26,887",
                    "mutual_fund" : {
                      "investment" : "2,42,70,255",
                      "current_value" : "4,54,12,143",
                    },
                    "equity" : {
                      "investment" : "1,62,80,119",
                      "current_value" : "2,88,77,284",
                    },
                    "post_office" : {
                      "investment" : "6,00,000",
                      "current_value" : "7,22,029",
                    },
                    "fd_bonds" : {
                      "investment" : "12,00,000",
                      "current_value" : "32,22,029",
                    },
                    "commodity" : {
                      "investment" : "5,54,00,000",
                      "current_value" : "72,22,029",
                    },
                    "real_estate" : {
                      "investment" : "60,54,00,000",
                      "current_value" : "1,97,83,03,851",
                    },
                    "pms_alt_investment" : {
                      "investment" : "4,54,85,143",
                      "current_value" : "71,76,71,900",
                    },
                    },
                    "insurance_portfolio_total" : {
                      "premium_per_year" : "564067",
                      "risk_cover" : "49400000",
                      "life_insurance" : {
                        "premium_per_year" : "530000",
                        "risk_cover" : "39000000",
                      },
                      "mediclaim" : {
                        "premium_per_year" : "31567",
                        "risk_cover" : "10300000",
                      },
                      "accidental" : {
                        "premium_per_year" : "0",
                        "risk_cover" : "0",
                      },
                      "vehicle" : {
                        "premium_per_year" : "0",
                        "risk_cover" : "0",
                      },
                      "others" : {
                        "premium_per_year" : "2600",
                        "risk_cover" : "100000",
                      },
                    }


                    
                  }
            });
            
          }
  }catch(err){
       res.status(400).json({
          "message" : "Error, Something went wrong."
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
  
const GetOpportunities = async (req, res) => {
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
            "client_pan_number" : client.user_details.pan_number,
            "client_goal" : "House Planning - House",
            "bank_name" : "Kotak",
            "date" : "01 Feb 2025",
            "duration" : "One Time",
            "amount" : "6,00,000",
          }
        ]
      })
    } else {
        return res.status(404).json({ message: 'No clients found for this investor' });
    }
   
} catch (error) {
  console.log("error --   "+ error);
  return res.status(500).json({ 
    "status" : false,
    message: "Error, Something went wrong",
    error: error.message 
  });
}
}


const GoalTracking = async (req, res) => {
    const clientId = req.params.clientId;
    if(!clientId) {
      return res.status(400).json({ "status" : false,  error: 'Invalid Client Id.' });
    }
    const clientData = await clientSchema.findById(clientId);
    if (!clientData) {
      return res.status(400).json({ "status" : false, error: 'Not valid Client.' });
    } else {
        return res.status(201).json({
              "status" : true,
              "goal_tracking" : {
                "goal_type" : "retirement",
                "goal_for" :` ${clientData.user_details.first_name} ${clientData.user_details.last_name}`,
                "created_on" : "20 Aug 2024",
                "goal_year": "2038",
                "current_age" : "24",
                "goal_duration" : "168",
                "goal_target" : "8,89,57,412",
                "achieved" : "8,46,546",
                "achievability" : "9.42%",
                "shortfall" : "8,05,79,107",
                "shortfall_recurring"  : "1,23,029",
                "shortfall_one_time" : "81,70,587",
                "total_investment_mapped" : {
                  "recurring" : "0",
                  "one_time" : "8,49,546",
                  "view_mapped_investment" : [
                    {
                        "type" : "mutual_fund",
                        "name" : "HDFC Liq - Reg (G)",
                        "NAV" : "4827.4955",
                        "allocation" : "25%",
                        "folio_no" : "10569084/11",
                        "investment_mode" : "Lumpsum",
                        "mapped_monthly" : "0",
                        "mapped_lumpsum" : "8,49,546"  
                    }
                  ],
                },
                "total_investment_planned" : {
                  "recurring" : "0",
                  "one_time" : "8,49,546",
                }
              }
        });
    }
}



  
module.exports ={ AddClient, ListOfAllClients, updateClientData,  GetClientMFReport, GetClientWealthReport, GetClientInformation, AddClientMutualFundReport, GoalTracking, GetOpportunities}; // AddUserDetails, AddBankDetails, ClientDeskSettings, FatcaDetails,


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
