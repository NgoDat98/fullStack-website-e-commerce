const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  cookie: {
    type: Object,
    required: true,
  },
  isLogin: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
