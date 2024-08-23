
const InvestorSchema = require('../models/investor');

const GetStockPrices = async (req, res) => {
    try {
      const investor_uid = req.investor.investor_uid;
      const data = await InvestorSchema.findOne({investor_uid});
      if (!data) {
        return res.status(404).json({ message: 'InValid Investor.' });
      }
      
      return  res.status(200).json({ 
        "status" : true,
        "data": [
            {
                "stock_name" : "Tata Motors", 
                "stock_price" : "1234.08",
                "movement_percentage" : "0.5%"
            },
            {
                "stock_name" : "SILVER", 
                "stock_price" : "651.00",
                "movement_percentage" : "-3.5%"
            },
            {
                "stock_name" : "Crude", 
                "stock_price" : "36.00",
                "movement_percentage" : "-3.5%"
            },
            {
                "stock_name" : "Nifty fifty", 
                "stock_price" : "24823.15",
                "movement_percentage" : "-1.2%"

            },
            {
                "stock_name" : "Nifty Bank", 
                "stock_price" : "52788.20",
                "movement_percentage" : "-0.550%"

            },
            {
                "stock_name" : "GOLD", 
                "stock_price" : "71471.00",
                "movement_percentage" : "277.0%"
            },
           
        ],
     });
      
    } catch (error) {
      console.error('Error getting clients:', error);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  }



module.exports ={ GetStockPrices }; // AddUserDetails, AddBankDetails, ClientDeskSettings, FatcaDetails,
