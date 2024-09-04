const {CrmSettings} = require('../models/crm_schema');
const investorSchema = require('../models/investor');
const clientSchema = require('../models/client');


const SetCRMRuleSetting = async (req, res) => {
    try{
        const { categoryRules, riskProfileRules } = req.body;
        const investor_uid = req.investor.investor_uid;

        const investor = await investorSchema.findOne({ investor_uid }).populate('crm_settings');
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }

        let crmSettings = investor.crm_settings;
        if (!crmSettings) {
            crmSettings = new CrmSettings({ crm_setting_uid: investor._id });
            investor.crm_settings = crmSettings._id;
            await crmSettings.save();
        }

        crmSettings.categoryRuleSchema = [];
        crmSettings.riskProfileRuleSchema = [];

        const newCategoryRules = categoryRules.map(rule => ({
            ...rule,
            investor_uid: investor._id
        }));
        crmSettings.categoryRuleSchema.push(...newCategoryRules);

        const newRiskProfileRules = riskProfileRules.map(rule => ({
            ...rule,
            investor_uid: investor._id
        }));
        crmSettings.riskProfileRuleSchema.push(...newRiskProfileRules);

        await crmSettings.save();
        await investor.save();

        return res.status(200).json({
            status: true,
            message: 'CRM settings updated successfully',
            crm_settings: crmSettings
        });


    } catch(err) {
        return res.status(200).json({
            "status" : false,
            "error" : "Error, Something went wrong.",
            "message" : err.message,
        });
    }
}

const UpdateRuleSetting = async (req, res) => {
    try {
        const {  ruleId, updatedRule } = req.body;
        const investor_uid = req.investor.investor_uid;
         const investor = await investorSchema.findOne({ investor_uid }).populate('crm_settings');
         if (!investor) {
             return res.status(404).json({ message: 'Investor not found' });
         }
 
         let crmSettings = investor.crm_settings;
         if (!crmSettings) {
             return res.status(404).json({ message: 'CRM settings not found for this investor' });
         }
 
        let ruleFound = false;

        for (let i = 0; i < crmSettings.categoryRuleSchema.length; i++) {
            if (crmSettings.categoryRuleSchema[i]._id.toString() === ruleId) {
                crmSettings.categoryRuleSchema[i] = { ...crmSettings.categoryRuleSchema[i]._doc, ...updatedRule };
                ruleFound = true;
                break;
            }
        }

        if (!ruleFound) {
            for (let i = 0; i < crmSettings.riskProfileRuleSchema.length; i++) {
                if (crmSettings.riskProfileRuleSchema[i]._id.toString() === ruleId) {
                    crmSettings.riskProfileRuleSchema[i] = { ...crmSettings.riskProfileRuleSchema[i]._doc, ...updatedRule };
                    ruleFound = true;
                    break;
                }
            }
        }
         if (!ruleFound) {
             return res.status(404).json({ message: 'Rule not found' });
         }
         await crmSettings.save();
         return res.status(200).json({
             status: true,
             message: 'Rule updated successfully',
             crm_settings: crmSettings
         });
    } catch (err) {
        return res.status(500).json({
            status: false,
            error: "Error, Something went wrong.",
            message: err.message,
        });
    }
};


const RemoveCRMRule = async (req, res) => {
    try {
        const { ruleId } = req.body;
        const investor_uid = req.investor.investor_uid;
        const investor = await investorSchema.findOne({ investor_uid }).populate('crm_settings');
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }
        let crmSettings = investor.crm_settings;
        if (!crmSettings) {
            return res.status(404).json({ message: 'CRM settings not found for this investor' });
        }
        crmSettings.categoryRuleSchema = crmSettings.categoryRuleSchema.filter(rule => rule._id.toString() !== ruleId);
        crmSettings.riskProfileRuleSchema = crmSettings.riskProfileRuleSchema.filter(rule => rule._id.toString() !== ruleId);
        await crmSettings.save();
        return res.status(200).json({
            status: true,
            message: 'Category rule deleted successfully'
        });
    } catch (err) {
        console.error('Error removing rule: ', err);
        return res.status(500).json({ message: 'Error removing rule.', error: err.message });
    }
}

const GetCRMRuleSetting = async (req, res) => {
    try{


        const investor_uid = req.investor.investor_uid; 

        const investor = await investorSchema.findOne({ investor_uid }).populate('crm_settings');

        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }

        if (!investor.crm_settings) {
            return res.status(200).json({ 
                message: 'CRM settings have not been set up for this investor.',
                crm_settings: null
            });
        }

        return res.status(200).json({
            message: 'CRM settings retrieved successfully',
            crm_settings: investor.crm_settings
        });

    } catch(err) {
        return res.status(200).json({
            "message" : "Error, Something went wrong.",
            "message" : err.message,
        });
    }
}

const ShowClientForBulkAnalysis = async (req, res) => {


   try{
    const investor_uid = req.investor.investor_uid; 
    const searchQuery = req.query.q;

    const excludeIncomplete = req.query.excludeIncomplete === 'true';

    console.log("excludeIncomplete   -----    "+ excludeIncomplete);

    // Build the dynamic query
    let query = { investor_uid: investor_uid };

    if (searchQuery) {
        query.$or = [
            { 'user_details.first_name': { $regex: new RegExp(searchQuery, 'i') } },
            { 'user_details.last_name': { $regex: new RegExp(searchQuery, 'i') } },
            { 'user_details.pincode': { $regex: new RegExp(searchQuery, 'i') } },
     
        ];
    }

    let clients = await clientSchema.find(query);


    if (excludeIncomplete) {
        clients = clients.filter(client => 
            !client.user_details.first_name ||
            !client.user_details.last_name |
            !client.user_details.company  ||
            !client.user_details.category ||
            !client.user_details.risk_profile ||
            !client.user_details.designation 
        );


        return res.status(200).json({
            message: 'Clients retrieved successfully.',
            clients: clients
        });
    }

    return res.status(200).json({
        message: 'Clients retrieved successfully.',
        clients: clients
    });


   } catch(err) {
        return res.status(200).json({
            "message" : "Error, Something went wrong.",
            "message" : err.message,
        });

   }


}


const SearchClient = async (req, res) => {
    try{

        const investor_uid = req.investor.investor_uid; 
        const searchQuery = req.query.q;

        let query = { investor_uid: investor_uid };

        if (searchQuery) {
            query.$or = [
                { 'user_details.first_name': { $regex: new RegExp(searchQuery, 'i') } },
                { 'user_details.last_name': { $regex: new RegExp(searchQuery, 'i') } },
                { 'user_details.pincode': { $regex: new RegExp(searchQuery, 'i') } },
                // { '_id': searchQuery }
            ];
        }

        const clients = await clientSchema.find(query);

        return res.status(200).json(clients);

    } catch(err) {
        return res.status(200).json({
            "message" : "Error, Something went wrong.",
            "message" : err.message,
        });
    }
}

const ClientAnalysisReport = async (req, res) => {
    try {

        const investor_uid = req.investor.investor_uid;

        const clients = await clientSchema.find({ investor_uid: investor_uid }).select('user_details.city user_details.pincode user_details.risk_profile user_details.category user_details.company user_details.designation');

        console.log("clients  ----    "+ clients);

        const cityWiseClients = clients.reduce((acc, client) => {
            const city = client.user_details.city || 'Unknown'; // Handle clients with no city specified
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});

        const pincodeWiseClients = clients.reduce((acc, client) => {
            const pincode = client.user_details.pincode || 'Unknown'; // Handle clients with no city specified
            acc[pincode] = (acc[pincode] || 0) + 1;
            return acc;
        }, {});

        const riskProfileWiseClients = clients.reduce((acc, client) => {
            const risk_profile = client.user_details.risk_profile || 'NA'; // Handle clients with no city specified
            acc[risk_profile] = (acc[risk_profile] || 0) + 1;
            return acc;
        }, {});

        const categoryeWiseClients = clients.reduce((acc, client) => {
            const category = client.user_details.category || 'NA'; // Handle clients with no city specified
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const companyWiseClients = clients.reduce((acc, client) => {
            const company = client.user_details.company || 'NA'; // Handle clients with no city specified
            acc[company] = (acc[company] || 0) + 1;
            return acc;
        }, {});

        const designationWiseClients = clients.reduce((acc, client) => {
            const designation = client.user_details.designation || 'NA'; // Handle clients with no city specified
            acc[designation] = (acc[designation] || 0) + 1;
            return acc;
        }, {});

        return res.json({
            "status" : true,
            "city": cityWiseClients,
            "pincode" : pincodeWiseClients,
            "riskProfile" : riskProfileWiseClients,
            "category" : categoryeWiseClients,
            "company" : companyWiseClients,
            "designation" : designationWiseClients,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            "status" : false,
            "error" : 'Server Error', 
            "message" : error.message
        });
    }
}

module.exports = {SetCRMRuleSetting, GetCRMRuleSetting, ShowClientForBulkAnalysis, SearchClient, RemoveCRMRule, UpdateRuleSetting, ClientAnalysisReport};