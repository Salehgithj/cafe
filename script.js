emailjs.init("F_Y99MCCu0_yZSRZS"); // User ID

let cart = [];

function addToCart(item, price) {
  cart.push({ item, price });
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById('cart');
  const totalSpan = document.getElementById('total');
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.item} - ${entry.price} تومان`;
    cartList.appendChild(li);
    total += entry.price;
  });

  totalSpan.textContent = total;
}

function sendOrder() {
  if (cart.length === 0) {
    alert("سبد خرید خالی است!");
    return;
  }

  let items = '';
  let total = 0;

  cart.forEach(entry => {
    items += `${entry.item} - ${entry.price} تومان\n`;
    total += entry.price;
  });

  const params = {
    items: items,
    total: total
  };

  emailjs.send("service_60u0yqx", "template_ecfhgae", params)
    .then(() => {
      alert("✅ سفارش با موفقیت ارسال شد!");
      cart = [];
      updateCart();
    })
    .catch((error) => {
      alert("❌ خطا در ارسال سفارش: " + JSON.stringify(error));
    });
}
