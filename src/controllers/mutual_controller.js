const ClientSchema = require('../models/client');
const Notifications = require('../models/notification');
const MFInvestment = require('../models/mf_scheme_investment');


const AddMFDetails = async (req, res, next) => {
    try {
        const {
          clientId,
          scheme_name,
          folio_number,
          inv_since,
          purchase,
          switch_in,
          div_reinv,
          redemption,
          switch_out,
          div_pay,
          cur_value,
          cur_units,
          cur_nav,
          gain_loss,
          abs_rtn,
          xirr
        } = req.body;
    
        const client = await ClientSchema.findById(clientId);
        if (!client) {
          return res.status(404).json({ status: false, error: 'Client not found' });
        }
    
        const newInvestment = new MFInvestment({
          scheme_name,
          folio_number,
          inv_since,
          purchase,
          switch_in,
          div_reinv,
          redemption,
          switch_out,
          div_pay,
          cur_value,
          cur_units,
          cur_nav,
          gain_loss,
          abs_rtn,
          xirr
        });
    
        const savedInvestment = await newInvestment.save();
    
        client.investments.push(savedInvestment._id);
        await client.save();
    
        res.status(200).json({
          status: true,
          message: 'Mutual Fund data added successfully',
          investment: savedInvestment,
        });
    
      } catch (err) {
        res.status(500).json({
          status: false,
          message: 'Error adding investment',
          error: err.message
        });
      }
};

const GetMFDetailsOfClient = async (req, res, next) => {
    try {
        const { clientId } = req.params;
    
        const client = await ClientSchema.findById(clientId).populate('investments');
        if (!client) {
          return res.status(404).json({ status: false, error: 'Client not found' });
        }
    
        return res.status(200).json({
          status: true,
          investments: client.investments
        });
      } catch (err) {
        res.status(500).json({
          status: false,
          message: 'Error retrieving investments',
          error: err.message
        });
      }
};

const GetFundsListOfClientOfInvestments = async (req, res, next) => {
  try {
      const { clientId } = req.params;
  
      
      const client = await ClientSchema.findById(clientId).populate({
        path: 'investments',
        select: 'scheme_name folio_number' 
      });
      if (!client) {
        return res.status(404).json({ status: false, error: 'Client not found' });
      }
  
      const schemes = client.investments.map(investment => ({
        scheme_name: investment.scheme_name,
        folio_number: investment.folio_number
      }));
  
      return res.status(200).json({
        status: true,
        schemes: schemes
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Error retrieving investments',
        error: err.message
      });
    }
};


module.exports = { AddMFDetails, GetMFDetailsOfClient, GetFundsListOfClientOfInvestments };