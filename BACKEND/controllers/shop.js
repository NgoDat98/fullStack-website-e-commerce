const nodemailer = require("nodemailer");
const sendfridTransport = require("nodemailer-sendgrid-transport");
// const sgMail = require("@sendgrid/mail");

const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendfridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

// sgMail.setApiKey(
//   "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"
// );

exports.getProduct = (req, res, next) => {
  const prodId = req.query.prodId;
  Product.findById(prodId)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  const userId = req.body.userId;
  const fullName = req.body.fullName;
  const phoneNumber = req.body.phoneNumber;
  const total = req.body.total;
  const address = req.body.address;
  const toEmail = req.body.toEmail;
  const date = req.body.date;
  const delivery = false;
  const status = false;
  User.findById(userId)
    .then((user) => {
      user
        .populate("cart.items.productId")
        .then((user) => {
          const products = user.cart.items.map((i) => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
          });
          const order = new Order({
            name: user.fullName,
            userId: user._id,
            products: products,
            address: address,
            fullName: fullName,
            phoneNumber: phoneNumber,
            total: total,
            delivery: delivery,
            status: status,
            toEmail: toEmail,
            date: date,
          });
          return order.save();
        })
        .then((result) => {
          return user.clearCart();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.sendEmail = (req, res, next) => {
  const userId = req.body.userId;
  const email = req.body.email;
  const total = req.body.total;
  const fullname = req.body.fullname;
  const phone = req.body.phone;
  const address = req.body.address;
  const cart = req.body.carts;
  const moneyVND = (money) => {
    const str = money + "";
    let output = "";

    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      count++;
      output = str[i] + output;

      if (count % 3 === 0 && i !== 0) {
        output = "." + output;
        count = 0;
      }
    }

    return output;
  };
  const abc = cart.map(
    (items, index) =>
      `<tr key=${index}>
    <td style="border:1px solid white">${items.nameProduct}</td>
    <td style="border:1px solid white"><img src=${
      items.img
    } alt="..." width="70" />
    </td>
    <td style="border:1px solid white">${moneyVND(items.priceProduct)}VND</td>
    <td style="border:1px solid white">${items.count}</td>
    <td style="border:1px solid white">${moneyVND(
      items.priceProduct * items.count
    )}VND</td>
    </tr>`
  );
  User.findById(userId)
    .then((user) => {
      if (user) {
        return transporter.sendMail(
          {
            to: email,
            from: "ngodat0410@gmail.com",
            subject: "Order Success!",
            html: `<div style="
            background-color: black;
            color: white;
        ">
            <h1  style="
            color: white; ">Xin Chào ${fullname}</h1>
            <h3 style="
            color: white; ">Phone: ${phone}</h3>
            <h3 style="
            color: white; ">Address:${address}</h3>
            <table style="border:1px solid white">
            <thead>
              <tr>
                <th style="border:1px solid white">
                  <strong>Tên Sản Phẩm</strong>
                </th>
                <th style="border:1px solid white">
                  <strong>Ảnh</strong>
                </th>
                <th style="border:1px solid white">
                  <strong>Giá</strong>
                </th>
                <th style="border:1px solid white">
                  <strong>Số Lượng</strong>
                </th>
                <th style="border:1px solid white">
                  <strong>Thành Tiền</strong>
                </th>
              </tr>
            </thead>
            <tbody style="border:1px solid white ;
            text-align: center;">
            ${abc}
            </tbody>
            </table>
            <h1>Tổng Thành Toán:
            ${moneyVND(total)}VND</h1>
            <h1>Cảm ơn bạn!</h1>
            </div>`,
          },
          function (err, info) {
            if (err) {
              console.log("Email Not Sent!");
            } else {
              console.log("Email Sent Success!");
            }
          }
        );
        // return sgMail.send(
        //   {
        //     to: email,
        //     from: "ngodat0410@gmail.com",
        //     subject: "Order Success!",
        //     text: "Thanh you!",
        //   },
        //   function (err, info) {
        //     if (err) {
        //       console.log("Email Not Sent!");
        //     } else {
        //       console.log("Email Sent Success!");
        //     }
        //   }
        // );
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrdersIndex = (req, res, next) => {
  const userId = req.query.idUser;
  Order.find({ userId: userId })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDetailOerder = (req, res, next) => {
  const orderId = req.params.id;
  Order.findById(orderId)
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      console.log(err);
    });
};
