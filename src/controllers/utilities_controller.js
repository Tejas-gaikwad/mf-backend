const ClientSchema = require('../models/client');
const InvestorSchema = require('../models/investor');
const MergedClients = require('../models/merged_clients');
const FamilySchema = require('../models/family_members');

  const mongoose = require('mongoose');

  const SearchClientByType = async (req, res) => {
    try{

        const investor_uid = req.investor.investor_uid; 
        const {searchQuery, searchBy} = req.body;

        let query = { investor_uid: investor_uid };

        if (searchQuery) {

          const searchField = `user_details.${searchBy}`;
          query[searchField] = { $regex: new RegExp(searchQuery, 'i') };
        }

        const clients = await ClientSchema.find(query);

        return res.status(200).json(clients);

    } catch(err) {
        return res.status(200).json({
            "message" : "Error, Something went wrong.",
            "message" : err.message,
        });
    }
  }

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
        const { mergedDocumentId } = req.params;
    
        const mergedClientDocument = await MergedClients.findById(mergedDocumentId)
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
  
  const DifferClient = async (req, res) => {
      try {
        const { main_client_id } = req.body;
      
        if (!main_client_id) {
          return res.status(404).json({ error: 'Client ID is required' });
        }

        const mergedClientDocument = await MergedClients.findOne({ main_client: main_client_id });

        if (!mergedClientDocument) {
          return res.status(404).json({ error: 'No merged client document found for the given client ID' });
        }

        const { investor_id } = mergedClientDocument;

        await MergedClients.findByIdAndDelete(mergedClientDocument._id);

        await InvestorSchema.updateOne(
          { _id: new mongoose.Types.ObjectId(investor_id) },
          { $pull: { merged_clients_ids: mergedClientDocument._id } }
        );
    
        return res.status(200).json({
          status: true,
          message: 'Merged client document deleted successfully and client removed from investor\'s merged list',
        });
        
      } catch (err) {
        return res.status(500).json({
          status: false,
          message: 'Error, something went wrong.',
          error: err.message,
        });
      }
  };

  const GetAllMergeClients = async (req, res) => {
      try {
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne( {investor_uid} )
              .populate({
                  path: 'merged_clients_ids',
                  populate: [
                      { path: 'main_client', model: 'Client' }, // Populate main client details
                      { path: 'merged_client_list', model: 'Client' } // Populate merged clients details
                  ]
              });
    
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }
        const mergedClients = investor.merged_clients_ids;
        return res.status(200).json({
          status: true,
          message: 'Merged clients retrieved successfully',
          data: mergedClients
        });
        
      } catch (err) {
        return res.status(500).json({
          status: false,
          message: 'Error, something went wrong.',
          error: err.message,
        });
      }
  };

  const CreateFamily = async (req, res) => {
    try{
        const {  familyHeadClientId, familyMembersClientId } = req.body;
        if ( !familyHeadClientId || !familyMembersClientId) {
            return res.status(400).json({  "status" : false, error: 'Invalid input' });
        }
        const existingFamily = await FamilySchema.findOne({ head_client: familyHeadClientId });
        if (existingFamily) {
            return res.status(400).json({  "status" : false, error: 'Head client already belongs to a family, add members to the family.'});
        }
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({  "status" : false, message: 'Investor not found' });
        }
        const headClientDocument = await ClientSchema.findById(familyHeadClientId);
        if (!headClientDocument) {
            return res.status(404).json({  "status" : false, message: 'Family Head client not found' });
        }
        const membersClientDocuments = await ClientSchema.find({ _id: { $in: familyMembersClientId.map(c => c) } });
        if (membersClientDocuments.length !== membersClientDocuments.length) {
            return res.status(404).json({ message: 'One or more members clients not found' });
        }
        const familyDocument = new FamilySchema({
            head_client: headClientDocument._id,
            family_members_client_list: membersClientDocuments.map(c => c._id),
            investor_id: investor._id
        });
        const savedDocument = await familyDocument.save();
        const documentId = savedDocument._id;
        await InvestorSchema.updateOne(
            { _id: investor._id },
            { $push: { family_ids: documentId } }
        );
            
        return res.status(201).json({
            "status" : true,
            "data" : "Family Created Successfully",
        })
    } catch(err){
            return res.status(500).send({
                message: 'Error, Something went wrong.',
                error: err.message
            });
    }
  }

  const GetAllFamilies = async (req, res) => {
    try {
      const investor_uid = req.investor.investor_uid;
      const investor = await InvestorSchema.findOne( {investor_uid} )
            .populate({
                path: 'family_ids',
                populate: [
                    { path: 'head_client', model: 'Client' }, // Populate main client details
                    { path: 'family_members_client_list', model: 'Client' } // Populate merged clients details
                ]
            });
  
      if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
      }
      const families = investor.family_ids;
      return res.status(200).json({
        status: true,
        message: 'Families retrieved successfully',
        data: families
      });
      
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Error, something went wrong.',
        error: err.message,
      });
    }
  };

  const GetFamilyMembersByClient = async (req, res) => {
      try {
        const { clientId } = req.params;

    
        const family = await FamilySchema.findOne({ head_client: clientId })
          .populate('head_client')
          .populate('family_members_client_list');
    
        if (!family) {
          return res.status(404).json({ error: 'Family not found' });
        }
    
        return res.status(200).json({
          status: true,
          data: family.family_members_client_list,
        });

      } catch (err) {
        
        return res.status(500).json({
          status: false,
          message: 'Error, something went wrong.',
          error: err.message,
        });
      }
  };

  const DeleteFamily = async (req, res) => {
    try {
      const { clientId } = req.params;
      if (!clientId) {
        return res.status(404).json({ error: 'Client ID is required' });
      }
      console.log("clientId  ----    "+ clientId);
      const family = await FamilySchema.findOne({ head_client: clientId });
      console.log("family._id  ----    "+ family);
      await  FamilySchema.findByIdAndDelete(family._id);
      await InvestorSchema.updateOne(
        { _id: new mongoose.Types.ObjectId(investor_uid) },
        { $pull: { family_ids: family._id } }
      );

      return res.status(200).json({
        status: true,
        message: 'Family Deleted Successfully',
      });
      
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Error, something went wrong.',
        error: err.message,
      });
    }
  };

  const DeleteFamilyMember = async (req, res) => {
    try {
      const { headMemberId, deleteMemberId } = req.body;

       if (!headMemberId || !deleteMemberId) {
        return res.status(400).json({ error: 'Both headMemberId and deleteMemberId are required' });
      }

      const family = await FamilySchema.findOne({ head_client: headMemberId });
       
      if (!family) {
        return res.status(404).json({ status: false, error: 'Family not found for the provided head client' });
      }

      const memberExists = family.family_members_client_list.includes(deleteMemberId);
      
      if (!memberExists) {
        return res.status(404).json({ status: false, error: 'Member not found in the family' });
      }

      await FamilySchema.updateOne(
        { _id: family._id },
        { $pull: { family_members_client_list: deleteMemberId } }
      );

      return res.status(200).json({
        status: true,
        message: 'Family member deleted successfully',
      });
      
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Error, something went wrong.',
        error: err.message,
      });
    }
  };


  const UpdateFamily = async (req, res) => {
    try {

      const { clientIdList, headClientId } = req.body;

         // Check if headClientId and clientIdList are provided
    if (!headClientId || !clientIdList || clientIdList.length === 0) {
      return res.status(200).json({
        status: false,
        error: 'Invalid input: headClientId or clientIdList missing'
      });
    }

      // Check if headClientId is in the clientIdList
      if (clientIdList.includes(headClientId)) {
        return res.status(200).json({
          status: false,
          error: 'Head client cannot be added as a family member'
        });
      }
  

    // Find the family document using the headClientId
    const familyDocument = await FamilySchema.findOne({ head_client: headClientId });
    if (!familyDocument) {
      return res.status(200).json({
        status: false,
        error: 'Family not found with the given head client'
      });
    }

    // Check if the clients in clientIdList exist in the ClientSchema
    const existingClients = await ClientSchema.find({ _id: { $in: clientIdList } });
    if (existingClients.length !== clientIdList.length) {
      return res.status(200).json({
        status: false,
        error: 'One or more clients from clientIdList not found'
      });
    }

    const alreadyInFamily = clientIdList.filter(clientId => 
      familyDocument.family_members_client_list.includes(clientId)
    );

    if (alreadyInFamily.length > 0) {
      return res.status(200).json({
        status: false,
        error: `Clients already in family: ${alreadyInFamily.join(', ')}`
      });
    }

    // Add new members to the family_members_client_list
    familyDocument.family_members_client_list = [
      ...new Set([...familyDocument.family_members_client_list, ...clientIdList])
    ];

    // Save the updated family document
    await familyDocument.save();

    return res.status(200).json({
      status: true,
      data: 'Family members added successfully'
    });


      // if (!clientIdList) {
      //   return res.status(404).json({ status: false, error: 'Client ID is required' });
      // }
      // const family = await FamilySchema.findOne({ head_client: headClientId });
      // if (!family) {
      //   return res.status(404).json({ status: false, error: 'Family not found for the provided head client' });
      // }

      
      // const memberExists = family.family_members_client_list.includes(clientId);
      // if(memberExists) {
      //   return res.status(404).json({ "status" : false, message: "Client already available in family." });
      // }
      // const familyData = await FamilySchema.findOneAndUpdate(
      //   { head_client: headClientId },
      //   { $push: { family_members_client_list: clientIdList } },
      //   { new: true } 
      // );
      // if (!familyData) {
      //   return res.status(404).json({ message: "Client not found in any family." });
      // }
      // return res.status(200).json({
      //   "status" : true,
      //   "message": "Member successfully added from the family.",
      //   "family" : familyData
      // });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Error, something went wrong.',
        error: err.message,
      });
    }
  };

module.exports = { MergeClients, GetMergedClients, DifferClient, GetAllMergeClients, CreateFamily, GetAllFamilies, GetFamilyMembersByClient, DeleteFamily, DeleteFamilyMember, SearchClientByType, UpdateFamily};