const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.postCheckIsAdmin = (req, res, next) => {
  const userId = req.body.userId;
  User.findById(userId)
    .then((user) => {
      if (user.role === "admin") {
        res.json({ isAuth: true });
      } else {
        res.json({ isAuth: false });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrderAll = (req, res, next) => {
  Order.find()
    .then((prod) => res.status(200).json(prod))
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  const page = req.query.page;
  const count = req.query.count;
  const search = req.query.search;
  const category = req.query.category;

  Product.find()
    .then((prod) => {
      let checkCategory;
      if (category !== "all") {
        checkCategory = prod.filter((x) => x.category === category);
      } else {
        checkCategory = prod;
      }

      if (search) {
        const filterSearch = checkCategory.filter((x) => {
          return (
            x.name.toUpperCase().trim().includes(search.toUpperCase().trim()) ||
            x.category
              .toUpperCase()
              .trim()
              .includes(search.toUpperCase().trim())
          );
        });

        return filterSearch;
      } else {
        return checkCategory;
      }
    })
    .then((product) => {
      const dataMovie = product;
      const PAGE_SIZE = count;
      const curruntPage = parseInt(page) ? parseInt(page) : 1;
      const start = (curruntPage - 1) * PAGE_SIZE;
      const end = (curruntPage - 1) * PAGE_SIZE + PAGE_SIZE;
      const item = dataMovie.slice(start, end);
      const total_pages = Math.ceil(dataMovie.length / PAGE_SIZE);

      return res.status(200).json({
        results: item,
        page: curruntPage,
        total_pages: total_pages,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewProduct = (req, res, next) => {
  const name = req.body.productName;
  const category = req.body.category;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;
  const price = req.body.productPrice;
  const count = req.body.productCount;
  const imageUrl = req.files;

  if (
    name &&
    category &&
    short_desc &&
    long_desc &&
    price &&
    count &&
    imageUrl.length === 5
  ) {
    const product = new Product({
      category: category,
      name: name,
      short_desc: short_desc,
      long_desc: long_desc,
      price: price,
      count: count,
      img1: `http://localhost:5000/${imageUrl[0].path}`,
      img2: `http://localhost:5000/${imageUrl[1].path}`,
      img3: `http://localhost:5000/${imageUrl[2].path}`,
      img4: `http://localhost:5000/${imageUrl[3].path}`,
      img5: `http://localhost:5000/${imageUrl[4].path}`,
    });
    return product.save();
  } else {
    res.status(400).send("Invalid data information!");
  }
};

exports.postUpdateProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const nameUpdate = req.body.productName;
  const categoryUpdate = req.body.category;
  const short_descUpdate = req.body.short_desc;
  const long_descUpdate = req.body.long_desc;
  const priceUpdate = req.body.productPrice;
  const countUpdate = req.body.productCount;
  const imageUrlUpdate = req.files;

  Product.findById(prodId)
    .then((product) => {
      product.name = nameUpdate;
      product.category = categoryUpdate;
      product.short_desc = short_descUpdate;
      product.long_desc = long_descUpdate;
      product.price = priceUpdate;
      product.count = countUpdate;
      if (imageUrlUpdate.length === 5) {
        product.img1 = `http://localhost:5000/${imageUrlUpdate[0].path}`;
        product.img2 = `http://localhost:5000/${imageUrlUpdate[1].path}`;
        product.img3 = `http://localhost:5000/${imageUrlUpdate[2].path}`;
        product.img4 = `http://localhost:5000/${imageUrlUpdate[3].path}`;
        product.img5 = `http://localhost:5000/${imageUrlUpdate[4].path}`;
      }

      return product.save();
    })
    .then((results) => {
      console.log("Update Success!");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const proId = req.body.productId;

  Product.findByIdAndRemove(proId)
    .then((results) => {
      console.log("Delete Prouct!!");
    })
    .catch((err) => {
      console.log(err);
    });
};
