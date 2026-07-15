const model=require("../models/paymentTypeModel");

// Get All

exports.getAll=async(req,res)=>{

try{

const data=await model.getPaymentTypes();

res.json(data);

}catch(err){

res.status(500).json({

message:err.message

});

}

};

// Get One

exports.getOne=async(req,res)=>{

try{

const data=await model.getPaymentType(req.params.id);

res.json(data);

}catch(err){

res.status(500).json({

message:err.message

});

}

};

// Add

exports.create=async(req,res)=>{

try{

const {payment_type,is_active}=req.body;

const data=await model.addPaymentType(

payment_type,

is_active

);

res.status(201).json(data);

}catch(err){

res.status(500).json({

message:err.message

});

}

};

// Update

exports.update=async(req,res)=>{

try{

const {payment_type,is_active}=req.body;

const data=await model.updatePaymentType(

req.params.id,

payment_type,

is_active

);

res.json({

message:"Updated Successfully",

data

});

}catch(err){

res.status(500).json({

message:err.message

});

}

};

// Delete

exports.delete=async(req,res)=>{

try{

await model.deletePaymentType(

req.params.id

);

res.json({

message:"Deleted Successfully"

});

}catch(err){

res.status(500).json({

message:err.message

});

}

};