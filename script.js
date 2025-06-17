emailjs.init("F_Y99MCCu0_yZSRZS");

let cart = [];

function handleOrderTypeChange(selectedValue) {
  const tableNumberContainer = document.getElementById('tableNumberInputContainer');
  const tableNumberInput = document.getElementById('tableNumber');
  if (selectedValue === 'داخل سالن') {
    tableNumberContainer.style.display = 'block';
  } else {
    tableNumberContainer.style.display = 'none';
    tableNumberInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const initialOrderType = document.querySelector('input[name="orderType"]:checked');
  if (initialOrderType) {
      handleOrderTypeChange(initialOrderType.value);
  }
});

function calculatePrepTime(cartItems) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (itemCount === 0) {
    return "مشخص نشده";
  } else if (itemCount >= 1 && itemCount <= 3) {
    return "زمان تحویل ۱۰ دقیقه";
  } else if (itemCount >= 4 && itemCount <= 6) {
    return "زمان تحویل ۲۰ دقیقه";
  } else if (itemCount >= 7 && itemCount <= 10) {
    return "زمان تحویل ۲۵ دقیقه";
  } else { // itemCount >= 11
    return "زمان تحویل ۴۰ دقیقه";
  }
}

function formatItemOptionsForDisplay(options) {
  if (!options || Object.keys(options).length === 0) {
    return '';
  }
  let optionStrings = [];
  if (options.size) optionStrings.push(`سایز: ${options.size}`);
  return optionStrings.length > 0 ? ` (${optionStrings.join('، ')})` : '';
}

function addToCart(itemName, itemPrice, itemOptions = null) {
  const existingItemIndex = cart.findIndex(cartItem =>
    cartItem.item === itemName &&
    cartItem.price === itemPrice &&
    JSON.stringify(cartItem.options) === JSON.stringify(itemOptions)
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ item: itemName, price: itemPrice, quantity: 1, options: itemOptions });
  }
  updateCart();
}

function addCakeWithOptions(itemName, basePrice, selectorContainerId) {
  const container = document.getElementById(selectorContainerId);
  const selectedRadioButton = container.querySelector('input[type="radio"]:checked');
  let selectedSize = 'نرمال'; 

  if (selectedRadioButton) {
    selectedSize = selectedRadioButton.value;
  } else {
    const firstRadio = container.querySelector('input[type="radio"]'); 
    if(firstRadio) {
        selectedSize = firstRadio.value; 
    }
  }

  const itemOptions = { size: selectedSize };
  let finalPrice = basePrice; 

  if (selectedSize === 'مینی') {
    finalPrice = basePrice * 0.7; 
  }

  addToCart(itemName, finalPrice, itemOptions);
}


function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById('cart');
  const totalSpan = document.getElementById('total');
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach((entry, index) => {
    const li = document.createElement('li');
    const itemTotalPrice = entry.price * entry.quantity;
    li.innerHTML = `
      ${entry.quantity} عدد ${entry.item}${formatItemOptionsForDisplay(entry.options)}
      (قیمت واحد: ${entry.price.toLocaleString('fa-IR')} تومان) - 
      مجموع: ${itemTotalPrice.toLocaleString('fa-IR')} تومان 
      <button onclick="removeFromCart(${index})">❌</button>
    `;
    cartList.appendChild(li);
    total += itemTotalPrice;
  });

  totalSpan.textContent = total.toLocaleString('fa-IR');
}

function showMessage(text, type = 'info') {
  const msgDiv = document.getElementById('message');
  msgDiv.textContent = text;
  msgDiv.className = `message ${type}`;
  msgDiv.style.display = 'inline-block';
  document.getElementById('orderConfirmation').style.display = 'none';
  setTimeout(() => {
    msgDiv.textContent = '';
    msgDiv.style.display = 'none';
    msgDiv.className = 'message';
  }, 8000);
}

function showOrderConfirmation(trackingId, orderDetails, orderType, totalAmount, prepTime, tableNumber) {
  document.getElementById('trackingNumber').textContent = trackingId;

  const confirmationItemsList = document.getElementById('confirmationCartItems');
  confirmationItemsList.innerHTML = '';
  orderDetails.forEach(entry => {
    const li = document.createElement('li');
    const itemTotalPrice = entry.price * entry.quantity;
    li.textContent = `
      ${entry.quantity} عدد ${entry.item}${formatItemOptionsForDisplay(entry.options)}
      (قیمت واحد: ${entry.price.toLocaleString('fa-IR')} تومان) - 
      مجموع: ${itemTotalPrice.toLocaleString('fa-IR')} تومان
    `;
    confirmationItemsList.appendChild(li);
  });

  document.getElementById('confirmationOrderType').textContent = orderType;

  const tableNumberLine = document.getElementById('confirmationTableNumberLine');
  const tableNumberStrong = document.getElementById('confirmationTableNumber');
  if (orderType === 'داخل سالن' && tableNumber) {
    tableNumberStrong.textContent = tableNumber;
    tableNumberLine.style.display = 'block';
  } else {
    tableNumberLine.style.display = 'none';
  }

  document.getElementById('confirmationPrepTime').textContent = prepTime;
  document.getElementById('confirmationTotal').textContent = totalAmount.toLocaleString('fa-IR');

  document.getElementById('message').style.display = 'none';
  document.getElementById('orderConfirmation').style.display = 'block';
}


function sendOrder() {
  if (cart.length === 0) {
    showMessage("سبد خرید خالی است!", 'error');
    return;
  }

  let itemsText = '';
  let total = 0;
  cart.forEach(entry => {
    const itemTotalPrice = entry.price * entry.quantity;
    itemsText += `${entry.quantity} عدد ${entry.item}${formatItemOptionsForDisplay(entry.options)} (قیمت واحد: ${entry.price} تومان) - مجموع: ${itemTotalPrice} تومان<br>`;
    total += itemTotalPrice;
  });

  const selectedOrderTypeElement = document.querySelector('input[name="orderType"]:checked');
  const orderType = selectedOrderTypeElement ? selectedOrderTypeElement.value : "مشخص نشده";

  let tableNum = '';
  if (orderType === 'داخل سالن') {
    tableNum = document.getElementById('tableNumber').value;
    const tableNumInt = parseInt(tableNum, 10);
    if (!tableNum || isNaN(tableNumInt) || tableNumInt < 1 || tableNumInt > 10) {
      showMessage("لطفاً شماره میز معتبری بین ۱ تا ۱۰ وارد کنید.", 'error');
      return;
    }
    tableNum = tableNumInt.toString();
  }

  const trackingId = `CAF-${Date.now().toString().slice(-6)}`;
  const prepTime = calculatePrepTime(cart);

  const params = {
    items: itemsText,
    total: total,
    orderType: orderType,
    tableNumber: tableNum,
    trackingId: trackingId,
    prepTime: prepTime
  };

  showMessage("⏳ در حال ارسال سفارش...", 'info');

  emailjs.send("service_60u0yqx", "template_ecfhgae", params)
    .then(() => {
      showOrderConfirmation(trackingId, [...cart], orderType, total, prepTime, tableNum);
      cart = [];
      updateCart();
      if (orderType === 'داخل سالن') {
        document.getElementById('tableNumber').value = '';
      }
    })
    .catch((error) => {
      showMessage("❌ خطا در ارسال سفارش: " + JSON.stringify(error), 'error');
    });
}