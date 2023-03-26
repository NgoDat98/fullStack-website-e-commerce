const RoomChat = require("../models/roomChat");
const io = require("../socket");
// client

exports.getMessageByRoomChatId = (req, res, next) => {
  const roomId = req.query.roomId;
  if (roomId) {
    RoomChat.findById(roomId)
      .then((message) => {
        if (message) {
          return res.status(200).json(message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.postCreatedNewRoom = (req, res, next) => {
  const roomChat = new RoomChat({ content: [] });
  try {
    return roomChat.save(function (err) {
      if (err) {
        return res.status(503);
      } else {
        return res.status(201).json(roomChat);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.putAddMessage = (req, res, next) => {
  const roomId = req.body.roomId;
  const is_admin = req.body.is_admin;
  const message = req.body.message;
  const date = req.body.date;
  RoomChat.findById(roomId)
    .then((room) => {
      room.content.push({ message: message, is_admin: is_admin, date: date });
      room.save();
      io.getIO().emit("receive_message", {
        is_admin: is_admin,
        message: message,
        date: date,
      });
    })
    .then((data) => {
      return res.json({ message: "Add new message!" });
    })
    .catch((err) => {
      console.log(err);
    });
};

// admin & Counselors

exports.getAllRoom = (req, res, next) => {
  RoomChat.find()
    .then((room) => {
      res.status(200).json(room);
    })
    .catch((err) => {
      console.log(err);
    });
};
