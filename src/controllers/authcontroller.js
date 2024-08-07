
// const users = [
//     { username: 'tester', password: '12345', login_type: '007' },  // there are only two login type which are corporate/ifa and sub broker
//     { username: 'user2', password: 'pass2', login_type: '008' }
// ];

const UserSchema = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 'mutual_fund_jwt_secret_key', { expiresIn: '1h' }); // Replace with a strong secret key
};
  
 
const Login = async (req, res) => {
    try{
        const {login_type, username, password} = req.body;
        if(!login_type || !username || !password) {
            return res.status(400).json({
                message : "All fields are required",
            });
        }
        if(login_type.toString() != "corporate" && login_type.toString() != "sub-broker") { // CHange this code of login_type to proper login type
            return res.status(400).json({
                message : "Please provide right login type!",
            });
        }
        const user = await  UserSchema.findOne({ username, login_type }); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
        const accessToken = generateAccessToken(user);
        res.status(200).json({ token: accessToken, message: 'Login successful' , user: { id: user.id, username: user.username } });
    }catch(err) {
        console.log('Error -------   '+err);
        res.status(400).json({
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
    req.session.verificationCode = verificationCode;
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
        "message" : "Verification code sent successfully."
    });
    } catch(err) {
        console.log('Error -------   '+err);
        res.status(400).json({
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
        const {username, arnNumber, mobile, city, login_type, password} = req.body;
        if(!username || !mobile ){
            return res.status(400).json({
                "message":"please provide all data",
            });
        }
        const user = new UserSchema({ username, arnNumber, mobile, city, login_type, password,});
        const response = await user.save();
        res.status(201).json(response);
        } catch(err){
            console.log('Error -------   '+err);
            if (err.code === 11000) {
                res.status(400).json({ message: 'Please enter unique values.' });
              } else {
                res.status(400).json({ message: 'Error, Something went wrong.' });
              }
        }
}

module.exports = { Login, SendVerificationCode, BecomeMember, VerifyCode };