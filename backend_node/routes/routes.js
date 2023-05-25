const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuserdata");
const JWT_TOKEN = "IAMVIHAANSINGLA";
const JWT_TOKEN_2 = "IAMKHUSHSINGLA";
const Document = require("../models/Documents");
const Rooms = require("../models/Rooms");
const Roomuser = require("../models/Roomuser");
const DocsRoom = require("../models/Document_room");

// router.post("/document_room",async(req,res)=>{
//    try{

//    }

// })
router.post("/get_document",async(req,res)=>{

   try{
     const {room_id} = req.body;
     const data = await DocsRoom.findOne({room_id});

     res.send({status:"success",data:data});

   }catch(err){
    res.send({status:"error"});
   }
})
router.post("/get_room",fetchuser,async(req,res)=>{
   try{
      const {id} = req.user;
      
      const data = await Roomuser.find({ user_id: id });

      const updatedData = await Promise.all(
        data.map(async (roomuserdata) => {
          const room_data = await Rooms.findOne({ room_name: roomuserdata.room_id });
          return { ...roomuserdata._doc, room_title: room_data.room_title };
        })
      );
      
      
      res.send({status:"success",data:updatedData});


   }catch(error){
       console.log(error);
       res.send({status:"error",error:error});
   }

})
router.post("/room_details",fetchuser,async(req,res)=>{
  try{
    
     const {uid} = req.body;
     const {id} = req.user;

     const data = await DocsRoom.findOne({document_id:uid});
     const data2 = await Roomuser.findOne({user_id:id,room_id:data.room_id});

    res.send({status:"success",data:data,isAdmin:data2.isAdmin});

  }catch(error){
     console.log(error);
   res.send({status:"error",message:"some internal server error" })
  }

})
router.post("/document_title",async(req,res)=>{
   try{
     
      const {doc_id} = req.body;

      const data = await Document.findOne({uid:doc_id})

     res.send({status:"success",data:data.title})

   }catch(error){
    res.send({status:"error",message:"some internal server error" })
   }

})
router.post("/document_title_update",async(req,res)=>{

  try{
    const {doc_id,update_title} = req.body;
    if(update_title == ""){
      update_title = "Untitled Document"
    }
    Document.updateOne(
      { uid:doc_id }, // Condition to find the room
      { $set: { title:update_title } } // Update the room_title field
    )
      .then((result) => {
        res.send({status: 'success',message:"successfully edited"})
      })
      .catch((error) => {
        console.log(error);
        res.send({status: 'error',message:"Some internal server error"})

        // Handle error
      });

  }catch(error){

  }
})
router.post("/num_room_user",async(req,res)=>{
    
   try{
     const {room_name} = req.body;
     const data = await Roomuser.find({room_id:room_name});
      
     res.send({status:"success",data:data});
   }catch(err){
         res.send({status:"error",message:"some internal server error"});
   }

})
router.post("/get_user_documents",fetchuser,async(req,res)=>{
   
  try{
      const {id} = req.user;
      const docs = await Document.find({user_id:id});
      res.send({ status: "success", data:docs});


  }catch(e){

    res.send({ status: "error", message:"some internal server error"});

  }

})
router.post("/create_room", fetchuser, async (req, res) => {
  try {
    var { roomtitle, roomname, did } = req.body;
    const room_title = roomtitle;
    const room_name = roomname;
    const room_id = roomname;
    const document_id = did;
    const { id } = req.user;
    const user_id = id;
    const isAdmin = true;
    const cnt = await Rooms.countDocuments({ room_name: room_name });
    if (cnt > 0) {
      res.send({ status: "success", message: "Room key already assign" });
    } else {
      const room = Rooms({ room_title, room_name, user_id });

      room.save();

      const count = await Roomuser.countDocuments({
        room_id: room_name,
        user_id: user_id,
      });

      if (count == 0) {
        const roomuser = new Roomuser({
          room_id,
          user_id,
          isAdmin,
        });

        roomuser.save();
      }
       

      const count2 = await DocsRoom.countDocuments({
        room_id: room_name,
        document_id: did,
      });

      if (count2 == 0) {
        const docroom = new DocsRoom({
          room_id,
          document_id,
        });

        docroom.save();
      }

      const token_data = {
        user: {
          room_id: room_id,
          user_id: user_id,
        },
      };
    
      const authtoken = jwt.sign(token_data, JWT_TOKEN_2);


      res.send({ status: "success", message: "room created successfully",auth_token: authtoken });
    }
  } catch (err) {
    res.send({
      status: "error",
      message: "some internal server error",
      errro: err,
    });
  }
});
router.post("/getcontent", async (req, res) => {
  try {
    var { doc_id, user_id } = req.body;
    const document = await Document.findOne({ uid: doc_id});

    if (document) {
      // Document found, send the content in the response
      res.json({ content: document.content });
    } else {
      // Document not found
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    // Handle any errors that occurred
    console.log(error);
    res.status(500).json({ message: "Error retrieving document", error });
  }
});
router.post("/update_document", async (req, res) => {
  try {
    const { doc_id, update } = req.body;

    // const u8data = Buffer.from(update)
    // console.log(u8data)
    // const id =  new ObjectId(doc_id)
    // console.log(id)
    Document.findOne({ uid: doc_id }).then((doc) => {});
    Document.updateOne(
      { uid: doc_id },
      {
        /* Update fields and values here */
        content: update,
      }
    )
      .then((response) => {
        // Document update successful
        res.send({ status: "success" });
      })
      .catch((error) => {
        // Handle the error if needed
        res.send({ status: "error" });
      });
  } catch (err) {
    console.log(err);
  }
});
router.post("/create_documents", fetchuser, async (req, res) => {
  try {
    var { id, name, lastname } = req.user;

    var user_id = id;
    var { title, content, uid } = req.body;
    const document = new Document({
      title,
      content,
      uid,
      user_id,
    });

    const data = await document.save();
    res.send({ status: "success", message: "success", data: data.uid });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", message: error });
  }
});

router.post("/document_user_binding", (req, res) => {});

router.post("/room", fetchuser, async (req, res) => {
  try {
    var { id, name, lastname } = req.user;
    var user = id;
    var { room_title, room_name } = req.body;
    const room = new Rooms({
      room_name,
      user,
      room_title,
    });

    await room.save();
    res.send({ status: "success", message: "success" });
  } catch (err) {
    console.log(err);
  }
});
router.post('/get_token',fetchuser,async(req, res)=>{
     
  const {id} = req.user;
  const {room_id} = req.body;

  const token_data = {
    user: {
      room_id: room_id,
      user_id: id,
    },
  };

  const authtoken = jwt.sign(token_data, JWT_TOKEN_2);

  res.send({status:"success",auth_token:authtoken})


})
router.post("/room_user_binding", fetchuser, async (req, res) => {
  try {
    const { id, name, lastname } = req.user;
    const { room_name } = req.body;
    const user_id = id;
    const room_id = room_name;

    const count1 = await Rooms.countDocuments({ room_name: room_id });
    if (count1 > 0) {
      const count = await Roomuser.countDocuments({
        room_id: room_id,
        user_id: user_id,
      });


      const document_data = await DocsRoom.findOne({room_id: room_id});

      if (count == 0) {
        const roomuser = new Roomuser({
          room_id,
          user_id,
        });

        roomuser.save();
        res.send({ status: "success", message: "join room succesfully",data:document_data.document_id,isAdmin:false });
      } else {
         const data = await Roomuser.findOne({user_id:user_id});

         if(data.isAdmin){
         const token_data = {
          user: {
            room_id: data.room_id,
            user_id: data.user_id,
          },
        };
  
        const authtoken = jwt.sign(token_data, JWT_TOKEN_2);
  

        res.send({ status: "success", message: "Join room successfully",data:document_data.document_id,isAdmin:data.isAdmin,auth_token:authtoken });
      }
      else{
        res.send({ status: "success", message: "join room succesfully",data:document_data.document_id,isAdmin:false });

      }
      }
    } else {
      res.send({ status: "error", message: "Your entered key is wrong" });
    }
  } catch (error) {
    console.error("Error checking room existence:", error);
    res.send({ status: "error", message: "you already joined this room" });
  }
});

module.exports = router;
