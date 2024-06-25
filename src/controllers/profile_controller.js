const UserSchema = require('../models/user');

const GetUserProfile = async (req, res) => {
    try{
        const {username} = req.body; 
        const user = await  UserSchema.findOne({ username });  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });

    }catch(err) {
      
        res.status(400).json({
            "message" : "Error, Something went wrong."
        });
    }
};


module.exports = {GetUserProfile };