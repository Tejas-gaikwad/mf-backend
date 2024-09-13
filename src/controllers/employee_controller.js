const EmployeeSchema = require('../models/employee');
const InvestorSchema = require('../models/investor');
const MergedClients = require('../models/merged_clients');
const FamilySchema = require('../models/family_members');

const mongoose = require('mongoose')

const AddEmployee = async (req, res) => {
  try{

    const investor_uid = req.investor.investor_uid;
    const { personal_information, access_control, bank_information, upload_document } = req.body;
    if ( !personal_information.mobile_number || !personal_information.pan_number ||  !personal_information.email ) {
        return res.status(400).json({ message: 'Please provide all data.' });
    }
    const investor = await InvestorSchema.findOne({investor_uid});
    if (!investor) {
        return res.status(404).json({ message: 'Investor not found' });
    }
    const phone = personal_information.mobile_number;
    const phoneExist = await EmployeeSchema.findOne({ 'personal_information.mobile_number': phone });
    if (phoneExist) {
      return res.status(400).json({ message: 'This phone number is already used by other user.' });
      }

    const emailId = personal_information.email;
    const emailExist = await EmployeeSchema.findOne({ 'personal_information.email': emailId });
    if (emailExist) {
      return res.status(400).json({ message: 'This Email Id already used by other user.' });
      }

    const panCard = personal_information.pan_number;
    const panExist = await EmployeeSchema.findOne( { 'personal_information.pan_number': panCard });

    if (panExist) {
      return res.status(400).json({ message: 'This Pan Card is already used by other user.' });
    }

    
    const employee = new EmployeeSchema({ investor_uid,  personal_information, access_control, bank_information, upload_document }); // arn_number,
    const savedEmployee = await employee.save();
    if (!investor.employees) {
      investor.employees = [];
    }
    investor.employees.push(savedEmployee._id);
    await investor.save();
    res.status(201).json({ message: 'Employee added successfully', employee: savedEmployee });



  } catch(err) {
      return res.status(200).json({
          "message" : "Error, Something went wrong.",
          "message" : err.message,
      });
  }
}

const GetAllEmployees = async (req, res) => {
    try {
      const investor_uid = req.investor.investor_uid;

      const data = await InvestorSchema.findOne({investor_uid}).populate('employees').exec();
      if (!data) {
        return res.status(404).json({ status : false, message: 'Investor not found' });
      }
      return res.status(200).json({ 
        status : true,
        employees: data.employees
       });
    } catch (error) {
      console.error('Error getting Employees:', error);
      res.status(500).json({ status : false, message: 'Failed to get clients' });
    }
}


const UpdateEmployeeData = async (req, res) => {
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }
        const updateData = req.body;
        const employeeId = req.params.employeeId;
        const employeeData = await EmployeeSchema.findById(employeeId);
        if (!employeeData) {
            return res.status(404).json({  "status" : false, message: 'Employee not found' });
        }
  
        if(employeeData.personal_information.pan_number !== updateData.personal_information.pan_number) {
          return res.status(400).json({ "status" : false, message: 'Cannot change Pan card number.' });
        }
  
        if( employeeData.personal_information.email !== updateData.personal_information.email ) {
          return res.status(400).json({ "status" : false, message: 'Cannot change Email.' });
        }
        if(employeeData.personal_information.mobile_number !== updateData.personal_information.mobile_number) {
          return res.status(400).json({ "status" : false, message: 'Cannot  Phone number.' });
        }  
        const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(employeeId, { $set: updateData }, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({  "status" : false, message: 'Cannot update Employee' });
        }
        return res.status(201).json({
          "status" : true,
          "data" : updatedEmployee
        });
    } catch(err){
        console.log("err --   ", err);
        res.status(400).json({
          "status" : false,
            "message" : "Error, Something went wrong."
        });
    }
  }

  const DeleteEmployee = async (req, res) => {
    try{
        const investor_uid = req.investor.investor_uid;
        const investor = await InvestorSchema.findOne({investor_uid});
        if (!investor) {
          return res.status(404).json({ message: 'Investor not found' });
        }
        const employeeId = req.params.employeeId;
        const employeeData = await EmployeeSchema.findByIdAndDelete(employeeId);
        if (!employeeData) {
            return res.status(404).json({  "status" : false, message: 'Employee not found' });
        }
        await InvestorSchema.updateOne(
            { _id: new mongoose.Types.ObjectId(investor_uid) },
            { $pull: { employees: employeeId } }
        );
        
        return res.status(201).json({
          "status" : true,
          "message" : "Employee Deleted Successfully."
        });

    } catch(err){
        console.log("err --   ", err);
        res.status(400).json({
          "status" : false,
            "message" : "Error, Something went wrong."
        });
    }
  
  }


module.exports = {AddEmployee, GetAllEmployees, UpdateEmployeeData, DeleteEmployee};