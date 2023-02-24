import { settings, select, templates, classNames } from '../settings.js';
import CartProduct from './cartProduct.js';
import utils from '../utils.js';
class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = []; 
    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = element.querySelector(
      select.cart.subtotalPrice
    );
    thisCart.dom.totalPrice = element.querySelector(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.totalPriceTitle = element.querySelector(
      select.cart.totalPriceTitle
    );
    thisCart.dom.cartProductRemove = element.querySelector(
      select.cartProduct.remove
    );
    thisCart.dom.cartProductEdit = element.querySelector(
      select.cartProduct.edit
    );
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.formSubmit = element.querySelector(select.cart.formSubmit);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
  }
  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(
      new CartProduct(menuProduct, generatedDOM, thisCart.dom.productList)
    );
    thisCart.update();
  }
  update() {
    const thisCart = this;
    let deliveryFee = 0;
    let totalNumber = 0;
    let subtotalPrice = 0;
    let totalPrice = 0;

    for (let product of thisCart.products) {
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }
    if (totalNumber) {
      deliveryFee = settings.cart.defaultDeliveryFee;
      totalPrice = subtotalPrice + deliveryFee;
    }
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.totalPriceTitle.innerHTML = totalPrice;
    thisCart.dom.totalPrice.innerHTML = totalPrice;
  }
  remove(cartProduct) {
    const thisCart = this;
    let indexProduct = thisCart.products.indexOf(cartProduct);
    if (indexProduct !== -1) {
      thisCart.products.splice(
        indexProduct,
        1
      );
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    }
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: settings.cart.defaultDeliveryFee,
      products: [],
    };
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
      });
  }
}

export default Cart;