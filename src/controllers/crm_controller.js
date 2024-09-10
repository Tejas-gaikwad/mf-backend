
const mongoose = require('mongoose');

const {CrmSettings} = require('../models/crm_schema');
const investorSchema = require('../models/investor');
const clientSchema = require('../models/client');
const Vendor = require('../models/vendor');
const VendorItemsSchema = require("../models/vendor_items");

const AboutUsCollection = mongoose.connection.collection('about_us_collection');
const TermsAndConditionsCollection = mongoose.connection.collection('terms_and_conditions');





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

const AddVendor = async (req, res) => {

   try{
        const { vendor_name, mobile_number, email_address, address } = req.body;
        const investor_uid = req.investor.investor_uid;

        const investor = await investorSchema.findOne({ investor_uid });

        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }

        const newVendor = new Vendor({
            vendor_name,
            mobile_number,
            email_address,
            address
        });

        const savedVendor = await newVendor.save();

        await investorSchema.findByIdAndUpdate(investor_uid, {
            $push: { vendors: savedVendor._id }
        });

       return res.status(201).json({ message: 'Vendor added successfully', vendorId: savedVendor._id });
   }  catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({
                message: `Error: Duplicate value for ${field}. This field must be unique.`,
                field: field,
                value: error.keyValue[field]
            });
        } else{
            console.error(error);
            return res.status(500).send('Server Error');
        }
    }
}

const GetAllVendors  = async (req, res) => {

    try{

        const investor_uid = req.investor.investor_uid;
        const investor = await investorSchema.findById(investor_uid).populate('vendors'); //
        if(!investor) {
            return res.json({
                "status" : false,
                "message" : "No investor available"
            })
        }
        return res.json({
            "status" : true,
            "vendors": investor.vendors
        });

    }catch(err) {
        console.error(err);
        return res.json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }

}

const UpdateVendor = async (req, res) => {
    try{
        const {vendorId} = req.params;
        // const { vendor_name, mobile_number, email_address, address } = req.body;
        const updateData = req.body;

        const investor_uid = req.investor.investor_uid;

        const investor = await investorSchema.findOne({ investor_uid });

        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true, runValidators: true });

        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        return res.status(200).json({  "status" : true, message: 'Vendor updated successfully', vendor: updatedVendor });
    }catch(err) {
        console.error(err);
        return res.json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}

const DeleteVendor = async (req, res) => {
    try{
        const {vendorId} = req.params;
        const investor_uid = req.investor.investor_uid;
        const investor = await investorSchema.findOne({ investor_uid });
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }

        const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

        if (!deletedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        return res.status(200).json({  "status" : true, message: 'Vendor Deleted successfully'});
    }catch(err) {
        console.error(err);
        return res.json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}


const AddItemToVendor = async (req, res) => {
    try{
        const {vendor_id, vendor_name, item_name, item_price} = req.body;
        const investor_uid = req.investor.investor_uid;
        const investor = await investorSchema.findOne({ investor_uid });
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }
        const vendor = await Vendor.findById(vendor_id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        const newItem = new VendorItemsSchema({
            vendor_id: vendor_id,
            vendor_name: vendor_name,
            item_name: item_name,
            item_price:item_price,
        });
        const savedItem = await newItem.save();
        vendor.items.push(savedItem._id);
        await vendor.save();
        return  res.status(201).json({
            message: 'Item added successfully',
            item: savedItem
        });
    } catch(err) {
        console.error(err);
        return res.json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}

const GetAllItemsVendor = async (req, res) => {
    try{
        const {vendorId} = req.params;
        const investor_uid = req.investor.investor_uid;
        const investor = await investorSchema.findOne({ investor_uid });
        if (!investor) {
            return res.status(404).json({ message: 'Investor not found' });
        }
        const vendor = await Vendor.findById(vendorId).populate('items');
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        return res.status(200).json({  
            "status" : true, 
            message: 'Items retrieved successfully', 
            data : vendor.items,
        });

    } catch(err) {
        console.error(err);
        return res.json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        });
    }
}

const EditItemVendor = async (req, res) => {
    try{
        const {itemId} = req.params;
        const investor_uid = req.investor.investor_uid;
        const updateData = req.body;
        const investor = await investorSchema.findOne({ investor_uid });
        if (!investor) {
            return res.status(404).json({  "status" : false, message: 'Investor not found' });
        }
        const item = await VendorItemsSchema.findByIdAndUpdate(itemId,  updateData, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).json({ "status" : false, message: 'Item not found' });
        }
        return res.status(200).json({  "status" : true, message: 'Item Updated successfully', "item" : item});
    }catch(err) {
        console.error(err);
        return res.json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}

const DeleteItemVendor = async (req, res) => {
    try{
        const {itemId} = req.params;
        const investor_uid = req.investor.investor_uid;
        const updateData = req.body;
        const investor = await investorSchema.findOne({ investor_uid });
        if (!investor) {
            return res.status(404).json({  "status" : false, message: 'Investor not found' });
        }
        const item = await VendorItemsSchema.findByIdAndDelete(itemId);
        if (!item) {
            return res.status(404).json({ "status" : false, message: 'Item not found' });
        }
        return res.status(200).json({  "status" : true, message: 'Item Deleted successfully'});
    }catch(err) {
        console.error(err);
        return res.status(404).json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}


const AboutUs = async (req, res) => {
    try{

        const investor_uid = req.investor.investor_uid;
        const {about_us_content} = req.body;

        const investor = await investorSchema.findOne({ investor_uid });

        if (!investor) {
            return res.status(404).json({ "status" : false, message: 'Investor not found' });
        }else{

            if(!about_us_content) {
                return res.status(404).json({ "status" : false, "data": investor.about_us });
            }


    
            const result = await AboutUsCollection.insertOne({ about_us_content, created_at: new Date() });

            const aboutUsId = result.insertedId;

            // Update the Investor's about_us field
            const updatedInvestor = await investorSchema.findByIdAndUpdate(
                investor_uid,
                { about_us: aboutUsId },
                { new: true }
            );

            if (!updatedInvestor) {
                return res.status(404).json({ message: 'Investor not found' });
            }
    
            res.status(201).json({
                "status" : true,
                message: 'About us added successfully',
                data:  about_us_content,// This will return the inserted document
            });
        }
    }catch(err) {
        console.error(err);
        return res.status(404).json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}

const GetAboutUs = async (req, res) => {
    try{

        const investor_uid = req.investor.investor_uid;

        const investor = await investorSchema.findOne({ investor_uid });

        if (!investor) {
            return res.status(404).json({ "status" : false, message: 'Investor not found' });
        }
        
        const id = investor.about_us;
        const data = await AboutUsCollection.findOne(id);
    
           return res.status(201).json({
                "status" : true,
                "message": 'About Us',
                "data": data,
            });
        
    }catch(err) {
        console.error(err);
        return res.status(404).json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}


const TermsAndConditions = async (req, res) => {
    try{

        const investor_uid = req.investor.investor_uid;
        const {terms_and_conditions_content} = req.body;

        const investor = await investorSchema.findOne({ investor_uid });

        if (!investor) {
            return res.status(404).json({ "status" : false, message: 'Investor not found' });
        }else{

            if(!terms_and_conditions_content) {
                return res.status(404).json({ "status" : false, "data": investor.terms_and_conditions });
            }


    
            const result = await TermsAndConditionsCollection.insertOne({ terms_and_conditions_content, created_at: new Date() });

            const tmcId = result.insertedId;

            // Update the Investor's about_us field
            const updatedInvestor = await investorSchema.findByIdAndUpdate(
                investor_uid,
                { terms_and_conditions: tmcId },
                { new: true }
            );

            if (!updatedInvestor) {
                return res.status(404).json({           "status" : false, "message": 'Investor not found' });
            }
    
           return res.status(201).json({
                "status" : true,
                "message": 'Terms and conditions added successfully',
                "data":  terms_and_conditions_content,// This will return the inserted document
            });
        }
    }catch(err) {
        console.error(err);
        return res.status(404).json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}

const GetTermsAndConditions = async (req, res) => {
    try{

        const investor_uid = req.investor.investor_uid;

        const investor = await investorSchema.findOne({ investor_uid });

        if (!investor) {
            return res.status(404).json({ "status" : false, message: 'Investor not found' });
        }
        
        console.log("investor.terms_and_conditions   ----    "+ investor.terms_and_conditions);
        const id = investor.terms_and_conditions;
        const data = await TermsAndConditionsCollection.findOne(id);
    
           return res.status(201).json({
                "status" : true,
                "message": 'Terms and conditions',
                "data": data,
            });
        
    }catch(err) {
        console.error(err);
        return res.status(404).json({
            "status" : false,
            "message" : "Something went wrong",
            "error" : err.message
        })
    }
}





module.exports = {SetCRMRuleSetting, GetCRMRuleSetting, ShowClientForBulkAnalysis, SearchClient, RemoveCRMRule, UpdateRuleSetting, ClientAnalysisReport, AddVendor, GetAllVendors, UpdateVendor, DeleteVendor, AddItemToVendor, EditItemVendor, GetAllItemsVendor, DeleteItemVendor, AboutUs, TermsAndConditions, GetTermsAndConditions, GetAboutUs};