window.onscroll = function () {
  let header = document.getElementById("header");
  if (window.scrollY > 90) {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.308)";
  } else {
    header.style.backgroundColor = "transparent";
  }
};

let fetchListPhone = () => {
  listService
    .getlist()
    .then((res) => {
      let list = res.data;
      renderList(list);
    })
    .catch((err) => {
      console.log("error", err);
    });
};
fetchListPhone();

let renderList = (list) => {
  let content = "";
  list.forEach((data) => {
    let { id, name, price, backCamera, frontCamera, img, desc } = data;
    content += `<div class="col-lg-3 col-md-4 col-sm-6 col-12">
            <div
              class="card"
              style="
                 background-color: rgb(249, 239, 255);
                border-radius: 40px;
                padding: 15px;
                height: 550px;
                cursor: pointer
              "
               onmouseover="this.style.backgroundColor='rgba(215, 147, 255, 0.9)'" 
                onmouseout="this.style.backgroundColor='rgb(249, 239, 255)'"
            >
              <img
                src="${img}"
                class="card-img-top"
                style="
                  border-radius: 25px;

                  height: 250px;
                  object-fit: cover;
                "
                alt="..."
              />
              <div class="card-body">
                <h5
                  class="card-title"
                  style="font-size: 30px; font-weight: 700; height: 70px; text-align: center"
                >
                  ${name}
                </h5>
                <div style="height: 120px">
                <p class="card-text mb-0">${desc}</p>
                <p class="card-text mb-0">Camera trước: ${frontCamera}</p>
                <p class="card-text mb-0">Camera sau: ${backCamera}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p
                    class="fs-2 mb-0"
                    style="font-weight: 600; color: rgba(104, 49, 99, 0.774)"
                  >
                    ${price}$
                  </p>

                  <button
                  
                    class="btn button"
                    onclick='updateItemQuantity("${id}", 1)'
                    style="
                      background-color: rgba(104, 49, 99, 0.774);
                      color: #fff;
                      border-radius: 15px;
                    "
                    onmouseover="this.style.color='rgba(104, 49, 99, 0.774)'; this.style.backgroundColor='white';" 
                    onmouseout="this.style.color='white'; this.style.backgroundColor='rgba(104, 49, 99, 0.774)';"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>`;
  });
  document.getElementById("wrap-list").innerHTML = content;
};

let fetchCart = () => {
  cartService
    .getListCart()
    .then((res) => {
      let cart = res.data;
      renderCart(cart);
      let total = cart.reduce((sum, item) => sum + item.sum, 0);

      document.getElementById("sum").innerText = total.toLocaleString() + " $";
    })
    .catch((err) => {
      console.log("error", err);
    });
};
fetchCart();

let renderCart = (cart) => {
  let content = "";

  cart.forEach((data) => {
    let { id, name, price, img, quantity } = data;
    content += `<tr>
                <td>
                  <img
                    src=${img}
                    width="60"
                  />
                </td>
                <td>${name}</td>
                <td>
                  <button onclick='updateItemQuantity("${id}", -1)' class="btn btn-warning">-</button>
                  <span>${quantity}</span>
                  <button onclick='updateItemQuantity("${id}", 1)' class="btn btn-warning">+</button>
                </td>
                <td>${price}</td>
                <td>
                  <button onclick='deleteCart("${id}")' style="border: none; background: none; cursor: pointer;"><i class="fa fa-trash-alt"></i></button>
                </td>
              </tr>`;
  });
  document.getElementById("tbody-cart").innerHTML = content;
};

// let updateItemQuantity = (productId, change) => {
//   cartService.getListCart().then((res) => {
//     let cart = res.data;
//     let isValid = cart.find((item) => item.id === productId);

//     if (isValid) {
//       let newQuantity = isValid.quantity + change;

//       if (newQuantity <= 0) {
//         // xoá nếu hết số lượng
//         cartService.deleteCartItem(isValid.id).then(() => {
//           fetchCart();
//         });
//       } else {
//         let newItem = {
//           ...isValid,
//           quantity: newQuantity,
//           sum: isValid.price * newQuantity,
//         };
//         cartService.addToCart(newItem, isValid.id).then(() => {
//           fetchCart();
//         });
//       }
//     } else if (change > 0) {
//       // nếu chưa có thì thêm mới
//       listService.getItemById(productId).then((res) => {
//         let product = res.data;
//         let newItem = {
//           name: product.name,
//           price: product.price,
//           img: product.img,
//           quantity: 1,
//           sum: product.price,
//         };
//         cartService.createFirstCart(newItem).then(() => {
//           fetchCart();
//         });
//       });
//     }
//   });
// };
let updateItemQuantity = (productId, change) => {
  cartService.getListCart().then((res) => {
    let cart = res.data;
    let isValid = cart.find((item) => item.id === productId);

    if (isValid) {
      let newQuantity = isValid.quantity + change;

      if (newQuantity <= 0) {
        // Xóa nếu hết số lượng
        cartService.deleteCartById(isValid.id).then(() => {
          fetchCart();
        });
      } else {
        // Cập nhật lại item có id đó
        let newItem = {
          ...isValid,
          quantity: newQuantity,
          sum: isValid.price * newQuantity,
        };

        cartService.addToCart(newItem, isValid.id).then(() => {
          fetchCart();
        });
      }
    } else if (change > 0) {
      // Nếu chưa có thì thêm mới
      listService.getItemById(productId).then((res) => {
        let product = res.data;

        let newItem = {
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1,
          sum: product.price,
        };

        cartService.createFirstCart(newItem).then(() => {
          fetchCart();
        });
      });
    }
  });
};

let deleteCart = (idCart) => {
  cartService
    .deleteCartById(idCart)
    .then((res) => {
      console.log("xóa thành xông");
      console.log("res", res);
      fetchCart();
    })
    .catch((err) => {
      console.log("error", err);
    });
};
