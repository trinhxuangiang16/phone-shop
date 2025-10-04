const BASE_URL = "https://68c13f2b98c818a6940125be.mockapi.io";

let listService = {
  getlist: () => {
    return axios({
      url: `${BASE_URL}/admin`,
      method: "GET",
    });
  },
  getItemById: (id) => {
    return axios({
      url: `${BASE_URL}/admin/${id}`, // sửa đúng endpoint
      method: "GET",
    });
  },
};

let cartService = {
  getListCart: () => {
    return axios({
      url: `${BASE_URL}/cart`,
      method: "GET",
    });
  },

  getCartItem: (id) => {
    return axios({
      url: `${BASE_URL}/cart/${id}`,
      method: "GET",
    });
  },

  createFirstCart: (newItem) => {
    // Gọi api tạo cart item
    return axios({
      url: `${BASE_URL}/cart`,
      method: "POST",
      data: newItem,
    });
  },

  addToCart: (newItem, id) => {
    return axios({
      url: `${BASE_URL}/cart/${id}`, // sửa chữ "acrt" -> "cart"
      method: "PUT",
      data: newItem,
    });
  },
  deleteCartById: (id) => {
    let apiUrl = `${BASE_URL}/cart/${id}`;
    return axios({
      url: apiUrl,
      method: "DELETE",
    });
  },
};
