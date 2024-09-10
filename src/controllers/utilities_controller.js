const ClientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const MergedClients = require('../models/merged_clients');

const mongoose = require('mongoose')


const MergeClients = async (req, res) => {
    try{
        const {  mainClient, mergedClientList } = req.body;
        if ( !mainClient || !mergedClientList) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }

        const mainClientDocument = await ClientSchema.findById(mainClient);

        if (!mainClientDocument) {
            return res.status(404).json({ message: 'Main client not found' });
        }

        const mergedClientDocuments = await ClientSchema.find({ _id: { $in: mergedClientList.map(c => c) } });
        if (mergedClientDocuments.length !== mergedClientList.length) {
            return res.status(404).json({ message: 'One or more merged clients not found' });
        }

        const mergedClientDocument = new MergedClients({
            main_client: mainClientDocument._id,
            merged_client_list: mergedClientDocuments.map(c => c._id),
            investor_id: investor._id
        });

        const savedDocument = await mergedClientDocument.save();
        const documentId = savedDocument._id;

        await InvestorSchema.updateOne(
            { _id: investor._id },
            { $push: { merged_clients_ids: documentId } }
        );

            
        return res.status(201).json({
            "status" : true,
            "data" : "Client Merged Successfully",
        })
    } catch(err){
            return res.status(500).send({
                message: 'Error, Something went wrong.',
                error: err.message
            });
    }
}

const GetMergedClients = async (req, res) => {
    try {
      const { mergedClientId } = req.params;
  
      const mergedClientDocument = await MergedClients.findById(mergedClientId)
        .populate('main_client')
        .populate('merged_client_list');
  
      if (!mergedClientDocument) {
        return res.status(404).json({ error: 'Merged client not found' });
      }
  
      return res.status(200).json({
        status: true,
        data: mergedClientDocument,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Error, something went wrong.',
        error: err.message,
      });
    }
  };
  


module.exports = { MergeClients, GetMergedClients };