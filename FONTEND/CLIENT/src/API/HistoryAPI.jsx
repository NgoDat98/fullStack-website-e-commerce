import axiosClient from "./axiosClient";

const HistoryAPI = {
  getHistoryAPI: (query) => {
    const url = `/shop/histories${query}`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/shop/detail-order/${id}`;
    return axiosClient.get(url);
  },
};

export default HistoryAPI;
