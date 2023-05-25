const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_TOKEN = "IAMVIHAANSINGLA";
const validator = require('validator');
const Chat = require('../models/Chat');
const fetchuser = require("../middlewares/fetchuserdata");



router.post("/save_chat",async(req,res)=>{
  
    try{
      const {user_id,doc_id,room_id,message,name} = req.body;
       const chat = new Chat({doc_id,room_id,user_id,message,name});

       await chat.save();

       res.send({status:"success"});


    }catch(error){
        console.log(error);
      res.send({status:"error"});
    }

})


router.post("/get_chat",async(req,res)=>{
  
    try{
      const {doc_id,room_id} = req.body;

       const chats = await Chat.find({doc_id: doc_id,room_id: room_id});


       res.send({status:"success",data:chats});


    }catch(error){
      res.send({status:"error"});
    }

})


module.exports = router;
