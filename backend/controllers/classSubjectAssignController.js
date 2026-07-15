const model=require("../models/classSubjectAssignModel");

exports.getAll=async(req,res)=>{

try{

const data=await model.getAssignments();

res.json(data);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.getOne=async(req,res)=>{

try{

const data=await model.getAssignment(req.params.id);

res.json(data);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.create=async(req,res)=>{

try{

const {class_id,subject_id,is_active}=req.body;

const data=await model.addAssignment(

class_id,

subject_id,

is_active

);

res.status(201).json(data);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.update=async(req,res)=>{

try{

const {class_id,subject_id,is_active}=req.body;

const data=await model.updateAssignment(

req.params.id,

class_id,

subject_id,

is_active

);

res.json(data);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.delete=async(req,res)=>{

try{

await model.deleteAssignment(req.params.id);

res.json({

message:"Deleted Successfully"

});

}catch(err){

res.status(500).json({message:err.message});

}

};