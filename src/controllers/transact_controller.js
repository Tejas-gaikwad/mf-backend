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
                  "transaction_execution_date" : "20 August 2024",
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
                    "transaction_execution_date" : "12 August 2024",
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
                    "transaction_execution_date" : "5 July 2024",
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
                  "transaction_execution_date" : "20 September 2024",
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
                    "transaction_execution_date" : "12 September 2024",
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


const UpdateTransactionExecutionDate = async (req, res) => {

  try{
    const investor_uid = req.investor.investor_uid;
    const {date, amount, clientId} = req.body;
    const investor = await InvestorSchema.findOne({investor_uid});
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    const client = await clientSchema.findByIdAndUpdate(clientId);
      
    if (!client) {
        return res.status(404).json({ "status" : false, message: 'Client not found' });
    }

    return res.status(201).json({
      "status" : true,
      "data" : [
        {
          "client_name" : (client.user_details.first_name ? client.user_details.first_name : "") + " " + (client.user_details.last_name ? client.user_details.last_name : ""),
          "transaction_execution_date" : date,
          "folio_no" : "10569084",
          "name" : "HDFC Flexicap Fund - Growth option",
          "amount" : amount,
          "BSE_client_id": "8787",
          "member_id" : "11689",
          "moh" : "SI",
          "message" : "Invalid user name and password"
        },
      ]
    });

  } catch(err) {
    return res.status(201).json({
      "status" : false,
      "error" : err.message
    });
  }

}

  const InvestInTopSchemes = async (req, res) => {

    try{
        const investor_uid = req.investor.investor_uid;
        const  clientId = req.params.clientId;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }
        const client = await clientSchema.findOne(clientId);
          
        if (!client) {
            return res.status(404).json({ "status" : false, message: 'Client not found' });
        }

        return res.status(201).json({
          "status" : true,
          "data" : [
            {
              "scheme_name" : "bharath sir best",
              "scheme_id": "100",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "bhavesh sir Small cap",
              "scheme_id": "101",
              "funds_list" : [
                {
                  "fund_name" : "3630 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "Black Pearl Best Sip",
              "scheme_id": "102",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "Conservative",
              "scheme_id": "103",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
            
              ]
            },
            {
              "scheme_name" : "Gaurav's best scheme",
              "scheme_id": "104",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "Growth investment",
              "scheme_id": "105",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "Jharna Mid Cap Funds",
              "scheme_id": "106",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "M2m",
              "scheme_id": "107",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "Saad Best Small Cap Funds",
              "scheme_id": "108",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
            {
              "scheme_name" : "Vishal Sir Fund Recommended",
              "scheme_id": "109",
              "funds_list" : [
                {
                  "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
                  "latest_nav" : "21.63",
                  "like" : "0",
                  "fund_type" : "equity-index funds or ETFs",
                  "one_month_abs_return" : "5.31",
                  "one_year_XIRR_return" : "63.99",
                  "three_year_XIRR_return" : "21.75",
                  "five_year_XIRR_return" : "N/A",
                },
                {
                  "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
                  "latest_nav" : "37.01",
                  "like" : "0",
                  "fund_type" : "equity-Small cap fund",
                  "one_month_abs_return" : "9.60",
                  "one_year_XIRR_return" : "61.77",
                  "three_year_XIRR_return" : "22.27",
                  "five_year_XIRR_return" : "N/A",
                }
              ]
            },
          ]
        });
      
    } catch(err){
        return res.status(201).json({
          "status" : false,
          "error" : err.message
        });
    }
  }

  const InvestInExistingSchemes = async (req, res) => {
    try{
      const investor_uid = req.investor.investor_uid;
    const  clientId = req.params.clientId;
    const investor = await InvestorSchema.findOne({investor_uid});
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    const client = await clientSchema.findOne(clientId);
      
    if (!client) {
        return res.status(404).json({ "status" : false, message: 'Client not found' });
    }

    return res.status(201).json({
      "status" : true,
      "data" :  [
        {
          "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
          "latest_nav" : "21.63",
          "like" : "0",
          "fund_type" : "equity-index funds or ETFs",
          "one_month_abs_return" : "5.31",
          "one_year_XIRR_return" : "63.99",
          "three_year_XIRR_return" : "21.75",
          "five_year_XIRR_return" : "N/A",
          "moh":"single",
          "total_units":"2.37",
          "free_units":"2.37",
          "current_value":"4,406.04",
       
        },
        {
          "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
          "latest_nav" : "37.01",
          "like" : "0",
          "fund_type" : "equity-Small cap fund",
          "one_month_abs_return" : "9.60",
          "one_year_XIRR_return" : "61.77",
          "three_year_XIRR_return" : "22.27",
          "five_year_XIRR_return" : "N/A",
          "moh":"single",
          "total_units":"2.37",
          "free_units":"2.37",
          "current_value":"4,406.04",
        }
      ]
    });
    } catch(err) {
      return res.status(201).json({
        "status" : false,
        "error" : err.message
      });
    }
  }

  const AllSchemeList = async (req, res) => {
    try{
      const investor_uid = req.investor.investor_uid;
      const  clientId = req.params.clientId;
      const investor = await InvestorSchema.findOne({investor_uid});
      if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
      }
      const client = await clientSchema.findOne(clientId);
        
      if (!client) {
          return res.status(404).json({ "status" : false, message: 'Client not found' });
      }

      return res.status(201).json({
        "status" : true,
        "data" :  [
          {
            "fund_name" : "ICICI Pruduntial All Seasons Bond Fund - Annual  IdcW Payout",
            "latest_nav" : "37.01",
            "like" : "0",
            "fund_type" : "equity-Small cap fund",
            "one_month_abs_return" : "9.60",
            "one_year_XIRR_return" : "61.77",
            "three_year_XIRR_return" : "22.27",
            "five_year_XIRR_return" : "N/A",
          },
          {
            "fund_name" : "360 One Focused Equity Fund Regular Plan - Growth",
            "latest_nav" : "21.63",
            "like" : "0",
            "fund_type" : "equity-index funds or ETFs",
            "one_month_abs_return" : "5.31",
            "one_year_XIRR_return" : "63.99",
            "three_year_XIRR_return" : "21.75",
            "five_year_XIRR_return" : "N/A",    
          },
          {
            "fund_name" : "Bandhan Small Cap Fund Regular Plan - IDCW payout",
            "latest_nav" : "37.01",
            "like" : "0",
            "fund_type" : "equity-Small cap fund",
            "one_month_abs_return" : "9.60",
            "one_year_XIRR_return" : "61.77",
            "three_year_XIRR_return" : "22.27",
            "five_year_XIRR_return" : "N/A",
          }
        ]
      });
    } catch(err) {
      return res.status(201).json({
        "status" : false,
        "error" : err.message
      });
    }
  }

  const BuyNFO = async (req, res) => {

    const investor_uid = req.investor.investor_uid;
    const clientId = req.params.clientId;
    const investor = await InvestorSchema.findOne({investor_uid});
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    const client = await clientSchema.findOne(clientId);
      
    if (!client) {
        return res.status(404).json({ "status" : false, message: 'Client not found' });
    }

    return res.status(201).json({
      "status" : true,
      "data" :  [
        {
          "scheme_name" : "Axis consumption Fund - Regular Plan - Growth",
          "scheme_type" : "EQUITY",
          "scheme_min_investment" : "100",
          "scheme_launch_date" : "Aug 23 2024",
          "scheme_launch_date" : "Sep 6 2024",
        },
        {
          "scheme_name" : "Axis consumption Fund - Regular Plan - Growth",
          "scheme_type" : "EQUITY",
          "scheme_min_investment" : "100",
          "scheme_launch_date" : "Aug 23 2024",
          "scheme_launch_date" : "Sep 6 2024",
        },
        {
          "scheme_name" : "Axis consumption Fund - Regular Plan - Growth",
          "scheme_type" : "EQUITY",
          "scheme_min_investment" : "100",
          "scheme_launch_date" : "Aug 23 2024",
          "scheme_launch_date" : "Sep 6 2024",
        },
        {
          "scheme_name" : "Axis consumption Fund - Regular Plan - Growth",
          "scheme_type" : "EQUITY",
          "scheme_min_investment" : "100",
          "scheme_launch_date" : "Aug 23 2024",
          "scheme_launch_date" : "Sep 6 2024",
        },
      ]
    });

  }
  
  const RedemptionAnsSWP = async (req, res) => {

    try{
      const investor_uid = req.investor.investor_uid;
      const clientId = req.params.clientId;
      const investor = await InvestorSchema.findOne({investor_uid});
      if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
      }
      const client = await clientSchema.findOne(clientId);
        
      if (!client) {
          return res.status(404).json({ "status" : false, message: 'Client not found' });
      }
  
      return res.status(201).json({
        "status" : true,
        "data" :  [
          {
            "scheme_name" : "Axis Liquid Fund - Regular Plan - Growth",
            "scheme_type" : "Liquid Fund",
            "latest_nav" : "2,741.88",
            "folio_no" : "91023008102",
            "current_valuation" : "2,47,443.66",
            "all_units" : "90.246",
            "free_available_unit" : "90.246",
            "moh" : "Single",
            "likes" : "0"
          },
          {
            "scheme_name" : "Canara Robeco Savings Fund - Regular Growth",
            "scheme_type" : "Liquid Fund",
            "latest_nav" : "2,741.88",
            "folio_no" : "91023008102",
            "current_valuation" : "2,47,443.66",
            "all_units" : "90.246",
            "free_available_unit" : "90.246",
            "moh" : "Single",
            "likes" : "0"
          },
          {
            "scheme_name" : "Dsp Elss Tax Saver Fund - Regular Plan - Growth",
            "scheme_type" : "ELSS",
            "latest_nav" : "2,741.88",
            "folio_no" : "1854750/58",
            "current_valuation" : "4,35,443.66",
            "all_units" : "3100.758",
            "free_available_unit" : "90.246",
            "moh" : "Single",
            "likes" : "0"
          },
        ]
      });
    } catch(err){

    }


  }
  
  const SwitchAndStpAMC = async (req, res) => {

    try{
      const investor_uid = req.investor.investor_uid;
      const clientId = req.params.clientId;
      const investor = await InvestorSchema.findOne({investor_uid});
      if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
      }
      const client = await clientSchema.findOne(clientId);
        
      if (!client) {
          return res.status(404).json({ "status" : false, message: 'Client not found' });
      }
  
      return res.status(201).json({
        "status" : true,
        "data" :  [
          {
            "scheme_name" : "Axis Liquid Fund - Regular Plan - Growth",
            "scheme_type" : "Liquid Fund",
            "latest_nav" : "2,741.88",
            "folio_no" : "91023008102",
            "current_valuation" : "2,47,443.66",
            "all_units" : "90.246",
            "free_available_unit" : "90.246",
            "moh" : "Single",
            "likes" : "0"
          },
          {
            "scheme_name" : "Canara Robeco Savings Fund - Regular Growth",
            "scheme_type" : "Liquid Fund",
            "latest_nav" : "2,741.88",
            "folio_no" : "91023008102",
            "current_valuation" : "2,47,443.66",
            "all_units" : "90.246",
            "free_available_unit" : "90.246",
            "moh" : "Single",
            "likes" : "0"
          },
          {
            "scheme_name" : "Dsp Elss Tax Saver Fund - Regular Plan - Growth",
            "scheme_type" : "ELSS",
            "latest_nav" : "2,741.88",
            "folio_no" : "1854750/58",
            "current_valuation" : "4,35,443.66",
            "all_units" : "3100.758",
            "free_available_unit" : "90.246",
            "moh" : "Single",
            "likes" : "0"
          },
        ]
      });
    } catch(err){

    }


  }
  


  module.exports = { GetCurrentTransactionLog, GetFutureTransactionLog, UpdateTransactionExecutionDate, InvestInTopSchemes, InvestInExistingSchemes, AllSchemeList, BuyNFO, RedemptionAnsSWP, SwitchAndStpAMC };