const express = require("express");

const router = express.Router();

const roomChatController = require("../controllers/roomChat");

// /chatrooms/getById?roomId => get data theo RoomId xuất về phía client
router.get("/getById", roomChatController.getMessageByRoomChatId);

// /chatrooms/createNewRoom => post tạo một phòng chat mơi
router.post("/createNewRoom", roomChatController.postCreatedNewRoom);

// /chatrooms/addMessage => put data message mới vào datebase
router.post("/addMessage", roomChatController.putAddMessage);

// /chatrooms/getAllRoom => get data của tất cả các rôm
router.get("/getAllRoom", roomChatController.getAllRoom);

module.exports = router;
