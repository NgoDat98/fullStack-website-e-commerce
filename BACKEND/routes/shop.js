const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/product", shopController.getProduct);

router.post("/create-order", shopController.postOrder);

router.post("/email", shopController.sendEmail);

router.get("/histories", shopController.getOrdersIndex);

router.get("/detail-order/:id", shopController.getDetailOerder);

router.get("/check-count", shopController.checkCount);

module.exports = router;
