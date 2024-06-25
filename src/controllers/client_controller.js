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
        const {username } = req.body;
        const data = await User.findOne({username}).populate('clients').exec();

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