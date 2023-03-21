const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /checkIsAuth => check
router.post("/checkIsAuth", adminController.postCheckIsAdmin);

// /histories/all => get all products
router.get("/histories/all", adminController.getOrderAll);

// /products/pagination => get all products phân trang
router.get("/products/pagination", adminController.getProducts);

// /add-product => post thêm dữ liệu new product
router.post("/add-product", adminController.postNewProduct);

// /edit-product => Post dự liêu sửa lại dữ liệu sản phẩm cũ
router.post("/edit-product", adminController.postUpdateProduct);

// /delete-product => Post Id sản phẩm cần xóa
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
