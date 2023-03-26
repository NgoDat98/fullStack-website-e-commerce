import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../../convertMoney";
import axios from "axios";
import Swal from "sweetalert2";

ListCart.propTypes = {
  listCart: PropTypes.array,
  onDeleteCart: PropTypes.func,
  onUpdateCount: PropTypes.func,
};

ListCart.defaultProps = {
  listCart: [],
  onDeleteCart: null,
  onUpdateCount: null,
};

function ListCart(props) {
  const { listCart, onDeleteCart, onUpdateCount } = props;

  const handlerChangeText = (e) => {
    console.log(e.target.value);
  };

  const handlerDelete = (getUser, getProduct, count) => {
    if (!onDeleteCart) {
      return;
    }

    onDeleteCart(getUser, getProduct, count);
  };

  const handlerDown = (getIdUser, getIdProduct, getCount, calculation) => {
    if (!onUpdateCount) {
      return;
    }

    if (getCount === 1) {
      return;
    }

    //Trước khi trả dữ liệu về component cha thì phải thay đổi biến count
    const updateCount = parseInt(getCount) - 1;

    onUpdateCount(getIdUser, getIdProduct, updateCount, calculation);
  };

  const handlerUp = async (getIdUser, getIdProduct, getCount, calculation) => {
    if (!onUpdateCount) {
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/shop/check-count?prodId=${getIdProduct}`
    );
    const data = await res.data;

    if (data.count) {
      //Trước khi trả dữ liệu về component cha thì phải thay đổi biến count
      const updateCount = parseInt(getCount) + 1;

      onUpdateCount(getIdUser, getIdProduct, updateCount, calculation);
    } else {
      Swal.fire(
        "Số lượng sản phẩm này trong kho đã hêt, bạn không thể tăng thêm!!"
      );
    }
  };

  return (
    <div className="table-responsive mb-4">
      <table className="table">
        <thead className="bg-light">
          <tr className="text-center">
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Image</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Product</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Price</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Quantity</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Total</strong>
            </th>
            <th className="border-0" scope="col">
              {" "}
              <strong className="text-small text-uppercase">Remove</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {listCart &&
            listCart.map((value, index) => (
              <tr className="text-center" key={index}>
                <td className="pl-0 border-0">
                  <div className="media align-items-center justify-content-center">
                    <Link
                      className="reset-anchor d-block animsition-link"
                      to={`/detail/${value.idProduct}`}
                    >
                      <img src={value.img} alt="..." width="70" />
                    </Link>
                  </div>
                </td>
                <td className="align-middle border-0">
                  <div className="media align-items-center justify-content-center">
                    <Link
                      className="reset-anchor h6 animsition-link"
                      to={`/detail/${value.idProduct}`}
                    >
                      {value.nameProduct}
                    </Link>
                  </div>
                </td>

                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {convertMoney(value.priceProduct)} VND
                  </p>
                </td>
                <td className="align-middle border-0">
                  <div className="quantity justify-content-center">
                    <button
                      className="dec-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handlerDown(
                          value.idUser,
                          value.idProduct,
                          value.count,
                          "reduce"
                        )
                      }
                    >
                      <i className="fas fa-caret-left"></i>
                    </button>
                    <input
                      className="form-control form-control-sm border-0 shadow-0 p-0"
                      type="text"
                      value={value.count}
                      onChange={handlerChangeText}
                    />
                    <button
                      className="inc-btn p-0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handlerUp(
                          value.idUser,
                          value.idProduct,
                          value.count,
                          "increase"
                        )
                      }
                    >
                      <i className="fas fa-caret-right"></i>
                    </button>
                  </div>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    {convertMoney(
                      parseInt(value.priceProduct) * parseInt(value.count)
                    )}{" "}
                    VND
                  </p>
                </td>
                <td className="align-middle border-0">
                  <a
                    className="reset-anchor remove_cart"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handlerDelete(value.idUser, value.idProduct, value.count)
                    }
                  >
                    <i className="fas fa-trash-alt small text-muted"></i>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListCart;
