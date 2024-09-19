const ClientSchema = require('../models/client');
const Notifications = require('../models/notification');
const MFInvestment = require('../models/mf_scheme_investment');


const AddMFDetails = async (req, res, next) => {
    try {
        const {
          clientId,
          scheme_name,
          scheme_type,
          scheme_sub_type,
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
          scheme_type,
          scheme_sub_type,
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

const FilterGetMFDetailsOfClient = async (req, res, next) => {
  try {
       
      const { clientId } = req.params; // Assuming clientId is passed in the URL
      const { view_funds, transaction_duration, scheme_name } = req.body; // Filters from the request body

      // Fetch the client and populate the investments
      const client = await ClientSchema.findById(clientId).populate('investments');
      if (!client) {
        return res.status(404).json({ status: false, error: 'Client not found' });
      }

      let investments = client.investments;

      // 1. Handle 'view_funds' filter
      if (view_funds) {
        switch (view_funds) {
          case 'all_funds':
            // No filter needed, show all funds
            break;
          case 'selected_funds':
            if (!scheme_name) {
              return res.status(400).json({
                status: false,
                error: 'scheme_name is required when view_funds is selected_funds'
              });
            }

            // Filter to get only the specific scheme_name and folio_number
            investments = investments
              .filter(inv => inv.scheme_name.toLowerCase() === scheme_name.toLowerCase())
              .map(inv => ({
                scheme_name: inv.scheme_name,
                folio_number: inv.folio_number
              }));
            
            if (investments.length === 0) {
              return res.status(404).json({
                status: false,
                error: `No investments found for scheme_name: ${scheme_name}`
              });
            }
            break;
          case 'selected_type':
            // Filter to get only scheme_type and scheme_sub_type
            investments = investments.map(inv => ({
              scheme_type: inv.scheme_type,
              scheme_sub_type: inv.scheme_sub_type
            }));
            break;
          default:
            return res.status(400).json({
              status: false,
              error: 'Invalid value for view_funds'
            });
        }
      }

      // 2. Handle 'transaction_duration' filter
      if (transaction_duration) {
        const today = new Date();
        const filterYears = parseInt(transaction_duration.match(/\d+/)); // Extract the number of years

        if (!isNaN(filterYears)) {
          investments = investments.filter(inv => {
            const invSinceDate = new Date(inv.inv_since);
            const diffYears = (today - invSinceDate) / (1000 * 60 * 60 * 24 * 365); // Convert time difference to years
            return diffYears > filterYears;
          });
        }
      }

      // Return the filtered investments
      return res.status(200).json({
        status: true,
        investments: investments
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

const GetFundsTypesListOfClientOfInvestments = async (req, res, next) => {
  try {
      const { clientId } = req.params;
  
      
      const client = await ClientSchema.findById(clientId).populate({
        path: 'investments',
        select: 'scheme_type scheme_sub_type'
      });
      if (!client) {
        return res.status(404).json({ status: false, error: 'Client not found' });
      }
  
      const schemes = client.investments.map(investment => ({
        scheme_type: investment.scheme_type,
        scheme_sub_type: investment.scheme_sub_type
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



module.exports = { AddMFDetails, GetMFDetailsOfClient, GetFundsListOfClientOfInvestments, GetFundsTypesListOfClientOfInvestments, FilterGetMFDetailsOfClient };