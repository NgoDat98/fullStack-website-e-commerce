import React, { useEffect, useState } from "react";
import queryString from "query-string";
import CartAPI from "../API/CartAPI";
import CheckoutAPI from "../API/CheckoutAPI";
import convertMoney from "../convertMoney";
import "./Checkout.css";
import io from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";

const socket = io("http://localhost:5000");

function Checkout(props) {
  const [carts, setCarts] = useState([]);

  const [total, setTotal] = useState(0);

  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [emailRegex, setEmailRegex] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const [success, setSuccess] = useState(false);

  const [load, setLoad] = useState(false);

  //Hàm này dùng để gọi API và render số sản phẩm
  useEffect(() => {
    if (localStorage.getItem("id_user")) {
      const fetchData = async () => {
        const params = {
          idUser: localStorage.getItem("id_user"),
        };

        const query = "?" + queryString.stringify(params);

        const response = await CartAPI.getCarts(query);

        const arr = [];
        response.user.cart.forEach(function (item, index) {
          const data = {
            count: item.quantity,
            idProduct: item.productId._id,
            idUser: response.user._id,
            img: item.productId.img1,
            nameProduct: item.productId.name,
            priceProduct: item.productId.price,
          };
          arr.push(data);
        });

        setCarts(arr);

        getTotal(arr);

        if (response.length === 0) {
          window.location.replace("/cart");
        }
      };

      fetchData();
    }
  }, []);

  //Hàm này dùng để tính tổng tiền carts
  function getTotal(carts) {
    let sub_total = 0;

    const sum_total = carts.map((value) => {
      return (sub_total +=
        parseInt(value.priceProduct) * parseInt(value.count));
    });

    setTotal(sub_total);
  }

  //Check Validation
  const handlerSubmit = () => {
    if (!fullname) {
      setFullnameError(true);
      setEmailError(false);
      setPhoneError(false);
      setAddressError(false);
      return;
    } else {
      if (!email) {
        setFullnameError(false);
        setEmailError(true);
        setPhoneError(false);
        setAddressError(false);
        return;
      } else {
        setPhoneError(false);
        setAddressError(false);
        setFullnameError(false);

        if (!validateEmail(email)) {
          setEmailRegex(true);
          setFullnameError(false);
          setEmailError(false);
          setPhoneError(false);
          setAddressError(false);
          return;
        } else {
          setEmailRegex(false);

          if (!phone) {
            setFullnameError(false);
            setEmailError(false);
            setPhoneError(true);
            setAddressError(false);
            return;
          } else {
            setFullnameError(false);
            setEmailError(false);
            setPhoneError(false);
            setAddressError(false);

            if (!address) {
              setFullnameError(false);
              setEmailError(false);
              setPhoneError(false);
              setAddressError(true);
            } else {
              console.log("đang tiến hành thêm sản phẩm vào đơn hàng");

              const addOrderDB = async (
                userId,
                fullName,
                phoneNumber,
                total,
                address,
                toEmail,
                date
              ) => {
                // const params = {
                //   to: email,
                //   fullname: fullname,
                //   phone: phone,
                //   address: address,
                //   idUser: localStorage.getItem("id_user"),
                // };

                const response = await axios.post(
                  "http://localhost:5000/shop/create-order",
                  {
                    userId,
                    fullName,
                    phoneNumber,
                    total,
                    address,
                    toEmail,
                    date,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response) {
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Đặt đơn hàng thành công",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  setLoad(true);
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Lỗi! Không đặt được đơn hàng",
                    text: "Đã xảy ra sự cố, không thể thực hiện đặt Hàng.   Vui lòng xem lại thông tìn đơn hàng hoặc liên hệ tư vấn viên để được hỗ trợ.",
                    // footer:
                    //   '<a href="">Bạn có muốn liên hệ với tư vấn viên?</a>',
                  });
                }
              };

              addOrderDB(
                localStorage.getItem("id_user"),
                fullname,
                phone,
                total,
                address,
                email,
                new Date()
              );
            }
          }
        }
      }
    }
  };

  //Hàm này bắt đầu gửi Email xác nhận đơn hàng
  useEffect(() => {
    if (load) {
      const sendMail = async () => {
        try {
          const params = {
            to: email,
            total: total,
            fullname: fullname,
            phone: phone,
            address: address,
            carts: carts,
            idUser: localStorage.getItem("id_user"),
          };
          const response = await CheckoutAPI.postEmail(params);

          if (response.message === "success") {
            setTimeout(() => {
              setSuccess(true);
              setLoad(false);
            }, 3000);
          } else {
            setLoad(false);
            Swal.fire({
              icon: "error",
              title: "Lỗi! Không gửi được Email",
              text: "Đã xảy ra sự cố, không thể gửi được Email. Bạn vui lòng kiểm tra lại thông tin liên hệ hoặc liên hệ với tư vấn viên để được hỗ trợ.",
              // footer:
              //   '<a href="">Bạn có muốn liên hệ với tư vấn viên?</a>',
            });
          }
        } catch (err) {
          console.log(err);
        }
      };

      sendMail();

      const data = localStorage.getItem("id_user");

      // Gửi socket lên server
      socket.emit("send_order", data);
    }
  }, [load]);

  const onChangeName = (e) => {
    setFullname(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const onChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <div>
      {load && (
        <div className="wrapper_loader">
          <div className="loader"></div>
          <h3 className="textloader">
            Đang tiến hành lấy dữ liệu và gửi hóa đơn vào hộp thư của bạn!
          </h3>
        </div>
      )}

      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
              <div className="col-lg-6 text-lg-right">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/cart">Cart</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {!success && (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="row">
              <div className="col-lg-8">
                <form>
                  <div className="row">
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Fullname"
                      >
                        Full Name:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={fullname}
                        onChange={onChangeName}
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                      />
                      {fullnameError && (
                        <span className="text-danger">
                          * Please Check Your Full Name!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Email"
                      >
                        Email:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={email}
                        onChange={onChangeEmail}
                        type="text"
                        placeholder="Enter Your Email Here!"
                      />
                      {emailError && (
                        <span className="text-danger">
                          * Please Check Your Email!
                        </span>
                      )}
                      {emailRegex && (
                        <span className="text-danger">
                          * Incorrect Email Format
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Phone"
                      >
                        Phone Number:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={phone}
                        onChange={onChangePhone}
                        type="text"
                        placeholder="Enter Your Phone Number Here!"
                      />
                      {phoneError && (
                        <span className="text-danger">
                          * Please Check Your Phone Number!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Address"
                      >
                        Address:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={address}
                        onChange={onChangeAddress}
                        type="text"
                        placeholder="Enter Your Address Here!"
                      />
                      {addressError && (
                        <span className="text-danger">
                          * Please Check Your Address!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <a
                        className="btn btn-dark"
                        style={{ color: "white" }}
                        type="submit"
                        onClick={handlerSubmit}
                      >
                        Place order
                      </a>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {carts &&
                        carts.map((value, index) => (
                          <div key={index}>
                            <li className="d-flex align-items-center justify-content-between">
                              <strong className="small font-weight-bold">
                                {value.nameProduct}
                              </strong>
                              <br></br>
                              <span className="text-muted small">
                                {convertMoney(value.priceProduct)} VND x{" "}
                                {value.count}
                              </span>
                            </li>
                            <li className="border-bottom my-2"></li>
                          </div>
                        ))}
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span>{convertMoney(total)} VND</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <h1>You Have Successfully Ordered!</h1>
              <p style={{ fontSize: "1.2rem" }}>Please Check Your Email.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
