const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

// router.get("/products", shopController.getProducts);

router.get("/product", shopController.getProduct);

// router.get("/cart", shopController.getCart);

// router.post("/cart", shopController.postCart);

// router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.post("/create-order", shopController.postOrder);

router.get("/orders", shopController.getOrders);

router.post("/email", shopController.sendEmail);

router.get("/histories", shopController.getOrdersIndex);

router.get("/detail-order/:id", shopController.getDetailOerder);

module.exports = router;
