const { router } = require('../app');
const clientSchema = require('../models/client');
const User = require('../models/user');
const AddClient = async (req, res) => {
    try{
        const { username, name, email, phone, pan_number, date_of_birth, arn_number } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone are required' });
        }
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
          
        const existingClient = await clientSchema.findOne({ phone });
        if (existingClient) {
        return res.status(400).json({ message: 'Client with this phone number already exists' });
        }
        const client = new clientSchema({ username, arn_number, name, email, phone, pan_number, date_of_birth });
        const savedClient = await client.save();
        if (!user.clients) {
            user.clients = [];
          }
        user.clients.push(savedClient._id);
        await user.save();
        res.status(201).json({ message: 'Client added successfully', client: savedClient });
    } catch(err){
        console.log("err --   ", err);
        res.status(400).json({
            "message" : "Error, Something went wrong."
        });
    }
}
const ListOfAllClients = async (req, res) => {
   
    try {
      const  {userName}  = req.params.username;
        
      const data = await User.findOne({userName}).populate('clients').exec();
      if (!data) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ clients: data.clients });
      
      
    } catch (error) {
      console.error('Error getting clients:', error);
      res.status(500).json({ message: 'Failed to get clients' });
    }
}
module.exports ={ AddClient, ListOfAllClients};
const FatcaDetails = async (req, res) => {
  try{
      // const { bith_place, birth_country, wealth_source, politically_exposed_person, address_type, residence_country, income_slab } = req.body;
      const fatcaDetails = req.body;
      const { clientId } = req.params;
      if (!fatcaDetails) {
          return res.status(400).json({ message: 'Please provide all details' });
      }
      console.log("clientId --------  "+ clientId);
      console.log("fatcaDetails --------  "+ fatcaDetails);
      const client = await clientSchema.findById( clientId );
      console.log("client --------  "+ client);
      if (!client) {
        return res.status(400).json({ message: 'Client not found.'});
      }
      client.fatca_detials = fatcaDetails;
      await client.save();
      res.status(201).json({ message: 'Fatca details added successfully', client: client });
  } catch(err){
      console.log("err --   ", err);
      res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}
const AddUserDetails = async (req, res) => {
  try{
      // const { bith_place, birth_country, wealth_source, politically_exposed_person, address_type, residence_country, income_slab } = req.body;
      const userDetails = req.body;
      const { clientId } = req.params;
      if (!userDetails) {
          return res.status(400).json({ message: 'Please provide all details' });
      }
      console.log("clientId --------  "+ clientId);
      console.log("userDetails --------  "+ userDetails);
      const client = await clientSchema.findById( clientId );
      console.log("client --------  "+ client);
      if (!client) {
        return res.status(400).json({ message: 'Client not found.'});
      }
      client.user_details = userDetails;
      await client.save();
      res.status(201).json({ message: 'User details added successfully', client: client });
  } catch(err){
      console.log("err --   ", err);
      res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}
const AddBankDetails = async (req, res) => {
  try{
      // const { bith_place, birth_country, wealth_source, politically_exposed_person, address_type, residence_country, income_slab } = req.body;
      const bankDetails = req.body;
      const { clientId } = req.params;
      if (!bankDetails) {
          return res.status(400).json({ message: 'Please provide all details' });
      }
      console.log("clientId --------  "+ clientId);
      console.log("bankDetails --------  "+ bankDetails);
      const client = await clientSchema.findById( clientId );
      console.log("client --------  "+ client);
      if (!client) {
        return res.status(400).json({ message: 'Client not found.'});
      }
      client.bank_details = bankDetails;
      await client.save();
      res.status(201).json({ message: 'Bank details added successfully', client: client });
  } catch(err){
      console.log("err --   ", err);
      res.status(400).json({
          "message" : "Error, Something went wrong."
      });
  }
}
module.exports ={ AddClient, ListOfAllClients, FatcaDetails, AddUserDetails, AddBankDetails};