import axiosClient from "./axiosClient";

const CartAPI = {
  getCarts: (query) => {
    const url = `/cart${query}`;
    return axiosClient.get(url);
  },

  postAddToCart: (params) => {
    const url = `/carts/add`;
    return axiosClient.post(url, {
      idUser: params.idUser,
      idProduct: params.idProduct,
      count: params.count,
    });
  },

  deleteToCart: (params) => {
    const url = `/carts/delete`;
    return axiosClient.post(url, {
      idUser: params.idUser,
      idProduct: params.idProduct,
      count: params.count,
    });
  },

  putToCart: (query) => {
    const url = `/cart/update${query}`;
    return axiosClient.put(url);
  },
};

export default CartAPI;
