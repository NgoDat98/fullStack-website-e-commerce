const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

// /:userId => lấy ra danh user theo _id
router.get("/users/:userId", userController.getUserId);

// /carts/add => add product vào card của user cụ thể
router.post("/carts/add", userController.postCart);

// /carts => Get cart trong một user cụ thể
router.get("/cart", userController.getCart);

// /carts/update => Put update dữ liệu của cart trong user cụ thể
router.put("/cart/update", userController.updatedCart);

// /carts/delete => Post xóa 1 product cụ thể đã được đặt trong cart của user cụ thể
router.post("/carts/delete", userController.postCartDeletedProduct);
module.exports = router;
