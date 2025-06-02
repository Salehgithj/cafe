const cartItemsEl = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');

let cart = [];

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " تومان";
}

function updateCart() {
  cartItemsEl.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement('li');
    li.textContent = `${item.name} - ${formatPrice(item.price)} `;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'حذف';
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    li.appendChild(removeBtn);
    cartItemsEl.appendChild(li);
  });

  totalPriceEl.textContent = "مجموع: " + formatPrice(total);
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const itemDiv = button.parentElement;
    const name = itemDiv.getAttribute('data-name');
    const price = parseInt(itemDiv.getAttribute('data-price'));

    cart.push({ name, price });
    updateCart();
  });
});
