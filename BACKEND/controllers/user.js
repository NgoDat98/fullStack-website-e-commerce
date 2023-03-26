const User = require("../models/user");
const Product = require("../models/product");

exports.getUserId = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      return res.status(200).json({
        message: "Success",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const userId = req.query.idUser;
  User.findById(userId)
    .then((user) => {
      user.populate("cart.items.productId").then((prod) => {
        const products = prod.cart.items;
        res.status(200).json({
          user: {
            _id: prod._id,
            fullName: prod.fullName,
            cart: products,
            phoneNumber: prod.phoneNumber,
          },
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const userId = req.body.idUser;
  const prodId = req.body.idProduct;
  const count = Number(req.body.count);
  User.findById(userId)
    .then((user) => {
      Product.findById(prodId)
        .then((prod) => {
          user.addToCart(prod, count);
          prod.count = prod.count - count;
          return prod.save((err) => {
            console.log(err);
          });
        })
        .then((test) => {
          return res.status(200).json({ message: "Add to cart success!!" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updatedCart = (req, res, next) => {
  const userId = req.query.idUser;
  const prodId = req.query.idProduct;
  const count = req.query.count;
  const calculation = req.query.calculation;
  User.findById(userId)
    .then((user) => {
      Product.findById(prodId)
        .then((prod) => {
          user.updatedCart(prod, count);
          if (calculation === "reduce") {
            prod.count = prod.count + 1;
            prod.save();
          }
          if (calculation === "increase") {
            prod.count = prod.count - 1;
            prod.save();
          }
        })
        .then((update) => {
          return res.status(200).json({
            message:
              "The product in the cart has been successfully updated!!!!",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeletedProduct = (req, res, next) => {
  const userId = req.body.idUser;
  const prodId = req.body.idProduct;
  const count = Number(req.body.count);
  User.findById(userId)
    .then((user) => {
      Product.findById(prodId)
        .then((prod) => {
          user.removeFromCart(prod);
          prod.count = prod.count + count;
          return prod.save((err) => {
            console.log(err);
          });
        })
        .then((deleted) => {
          return res
            .status(200)
            .json({ message: "Product removed from cart Successful!!" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
