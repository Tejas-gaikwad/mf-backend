
// const users = [
//     { investor_uid: 'tester', password: '12345', login_type: '007' },  // there are only two login type which are corporate/ifa and sub broker
//     { investor_uid: 'user2', password: 'pass2', login_type: '008' }
// ];

const InvestorSchema = require('../models/investor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CrmSettings = require('../models/crm_schema');

const generateAccessToken = (investor) => {
    return jwt.sign({ id: investor.id, investor_uid: investor.investor_uid }, 'mutual_fund_jwt_secret_key', { expiresIn: '24h' }); // Replace with a strong secret key
};
  
const ChangePassword = async (req, res) => {
    const investor_uid = req.investor.investor_uid;
    const investor = await  InvestorSchema.findOne({investor_uid});

    if (!investor) {
      return res.status(404).json({ "status" : false, message: 'Investor not found' });
    }

    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, investor.password);
    console.log("isMatch  ---   "+ isMatch);

    if (!isMatch) {
        return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await InvestorSchema.updateOne(
        { investor_uid },
        { $set: { password: hashedPassword } }
    );

    return res.status(200).json({ 
        "status" : true,
        message: 'Password updated successfully',
        "investor_uid" : investor_uid,
    });
  }
 
const Login = async (req, res) => {
    try{
        console.log("LOGIN API CALL");
        const {login_type, mobile, password} = req.body;
        if(!login_type || !mobile || !password) {
            return res.status(400).json({
                message : "All fields are required",
            });
        }
        if(login_type.toString() != "corporate" && login_type.toString() != "sub-broker") { // CHange this code of login_type to proper login type
            return res.status(400).json({
                message : "Please provide right login type!",
            });
        }
        const investor = await  InvestorSchema.findOne({ mobile, login_type }); 
        if (!investor) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, investor.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid Mobile or password' });
        }
        const accessToken = generateAccessToken(investor);
        console.log("investor.id   ---    "+investor.id);
        return res.status(200).json({ 
            "status" : true,
            token: accessToken, 
            message: 'Login successful' , 
            investor: {  investor_uid: investor.id },
        });
    }catch(err) {
        console.log('Error -------   '+err);
        res.status(400).json({
            "status" : false,
            "message" : "Error, Something went wrong."
        });
    }
};

const SendVerificationCode = (req, res) => {
    try{
        const { mobileNo } = req.body;
    if(!mobileNo || mobileNo.length != 10) {
        return res.status(400).json({
            "messsage" : "Please provide valid mobile number",
        });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("verificationCode ----   "+verificationCode);
    
    // client.messages.create({
    //     body: `Your verification code is ${verificationCode}`,
    //     to: phoneNumber, // Text this number
    //     from: 'your_twilio_phone_number' // From a valid Twilio number
    // }).then((message) => {
    //     res.status(200).json({ message: 'Verification code sent successfully', sid: message.sid });
    // }).catch((error) => {
    //     res.status(500).json({ message: 'Failed to send verification code', error: error.message });
    // });
    
    // TODO add twilio client here.
    res.status(200).json({
        "status" : true,
        "message" : "Verification code sent successfully."
    });
    } catch(err) {
        console.log('Error -------   '+err);
        res.status(400).json({
            "status" : false,
            "message" : "Error, Something went wrong."
        });
    }
}

const VerifyCode = (req, res) => {
   try{
    const { verificationCode } = req.body;
  
    // Check if the code matches the one stored in the session
    if (verificationCode === req.session.verificationCode) {
      res.status(200).json({ message: 'Verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
    } catch(err) {
        console.log('Error -------   '+err);
        res.status(400).json({
            "message" : "Error, Something went wrong."
        });
    }
  };


const BecomeMember = async (req, res) => {
    try{
        const { arnNumber, full_name, mobile, city, login_type, password} = req.body;
        if(!arnNumber || !mobile || !password ||  !login_type){
            return res.status(400).json({
                "message":"please provide all data",
            });
        }

        const investorData = await InvestorSchema.findOne({mobile});

        if(investorData) {
           return res.status(400).json({ message: 'Mobile Number is already in use.' });
        }

        const investor = new InvestorSchema({ arnNumber, full_name, mobile, city, login_type, password,});

        const response = await investor.save();

        const updatedInvestor = await InvestorSchema.findByIdAndUpdate(
            response._id,
            { investor_uid: response._id },
            { new: true }
        );

        if (!updatedInvestor.crm_settings) {
            updatedInvestor.crm_settings = {
                crm_setting_uid: updatedInvestor._id,
                categoryRuleSchema: [],
                riskProfileRuleSchema: []
            };
        }
        
            const defaultCategoryRule = {
                category_name: 'Default Category Rule',
                minimum_aum_range: "10",
                maximum_aum_range: "100",
                investor_uid: updatedInvestor._id
            };

            const defaultRiskProfileRule = {
                profile_name: "default profile name",
                minimum_age_range: "HNI",
                maximum_age_range:"100",
                investor_uid: updatedInvestor._id
            };

            const crmSettingsData = new CrmSettings({
                crm_setting_uid: updatedInvestor._id,
                categoryRuleSchema: [defaultCategoryRule],
                riskProfileRuleSchema: [defaultRiskProfileRule]
            });

            const savedCrmSettings = await crmSettingsData.save();
    

            updatedInvestor.crm_settings = savedCrmSettings._id;
            await updatedInvestor.save();
    
            return res.status(201).json({
                "status" : true,
                "data" : updatedInvestor
            });

    } catch(err){
            console.log('Error -------   '+err);
        if (err.code === 11000) {
            return res.status(400).json({ 
                "status" : false,
                message: 'Please enter unique values.'
             });
        } else {
            return res.status(400).json({
                "status" : false,
                message: 'Error, Something went wrong.'
             });
        }
    }
}

module.exports = { Login, SendVerificationCode, BecomeMember, VerifyCode, ChangePassword };