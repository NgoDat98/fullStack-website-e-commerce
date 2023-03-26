const path = require("path");
const User = require("./models/user");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");

//test
// const { initializeApp } = require("firebase/app");

// const {
//   getStorage,
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
// } = require("firebase/storage");
// const config = require("./config/firebase");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@products1.xrmt4gr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const userRoutes = require("./routes/user");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const roomChatRoutes = require("./routes/roomChat");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

//test
// initializeApp(config.firebaseConfig);

// const storage = getStorage();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: fileFilter,
// });

// app.use(upload.array("image", 5), async (req, res) => {
//   try {
//     const dateTime = new Date();
//     const storageRef = ref(
//       storage,
//       `files/${req.file.originalname + "  " + dateTime}`
//     );
//     const metadata = {
//       contentType: req.file.mimetype,
//     };

//     const snapshot = await uploadBytesResumable(
//       storageRef,
//       req.file.buffer,
//       metadata
//     );

//     const downloadURL = await getDownloadURL(snapshot.ref);

//     console.log("files upload success!!");
//     return res.send({
//       message: "file upload to firebase storage",
//       name: req.file.originalname,
//       type: req.file.mimetype,
//       downloadURL: downloadURL,
//     });
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// });

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("image", 5)
);

const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
//   next();
// });

app.set("trust proxy", 1);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
    // store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(authRoutes);
app.use(userRoutes);
app.use("/shop", shopRoutes);
app.use("/admin", adminRoutes);
app.use("/chatrooms", roomChatRoutes);

// app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => {
    console.log("ok!");
    const server = app.listen(5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
      socket.on("disconnect", () => {
        console.log("client disconnect");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

// const server = http.createServer(app).listen(app.get("port"), function () {
//   console.log("Express server listening on port " + app.get("port"));
// });

// const io = socket.listen(server);
// io.sockets.on("connection", function () {
//   console.log("hello world im a hot socket");
// });
