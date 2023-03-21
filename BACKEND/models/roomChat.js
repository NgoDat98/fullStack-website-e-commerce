const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomChatSchema = new Schema({
  content: [
    {
      message: {
        type: String,
      },
      is_admin: {
        type: Boolean,
      },
      date: {
        type: String,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

module.exports = mongoose.model("RoomChat", roomChatSchema);
