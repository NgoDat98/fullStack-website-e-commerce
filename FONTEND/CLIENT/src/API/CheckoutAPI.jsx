import axiosClient from "./axiosClient";

const CheckoutAPI = {
  postEmail: (params) => {
    const url = `/shop/email`;
    return axiosClient.post(url, {
      userId: params.idUser,
      email: params.to,
      total: params.total,
      fullname: params.fullname,
      phone: params.phone,
      address: params.address,
      carts: params.carts,
    });
  },
};

export default CheckoutAPI;
