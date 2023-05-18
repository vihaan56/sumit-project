const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuserdata");
const JWT_TOKEN = "IAMVIHAANSINGLA";
const Document = require("../models/Documents");
const Rooms = require("../models/Rooms");
const Roomuser = require("../models/Roomuser");



router.post("/getcontent", async (req, res) => {
  try {
    var {doc_id,user_id} = req.body;
    const document = await Document.findOne({ uid: doc_id, user_id: user_id });

    if (document) {
      // Document found, send the content in the response
      res.json({ content: document.content });
    } else {
      // Document not found
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    // Handle any errors that occurred
    console.log(error)
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
    Document.findOne({ uid: doc_id }).then((doc) => {
    });
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

router.post("/room_user_binding", fetchuser, async (req, res) => {
  try {
    const { id, name, lastname } = req.user;
    const { room_name } = req.body;
    const user_id = id;
    const room_id = room_name;
    const count = await Roomuser.countDocuments({
      room_id: room_id,
      user_id: user_id,
    });

    if (count == 0) {
      const roomuser = new Roomuser({
        room_id,
        user_id,
      });

      roomuser.save();
      res.send({ status: "success", message: "room created successfully" });
    } else {
      res.send({ status: "error", message: "you already joined this room" });
    }
  } catch (error) {
    console.error("Error checking room existence:", error);
    res.send({ status: "error", message: "you already joined this room" });
  }
});

module.exports = router;
