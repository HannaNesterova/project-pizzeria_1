import { settings, select, templates, classNames } from '../setting.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products =[];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.sendOrder();
  }

  // що таке element?
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = document.querySelector( select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = document.querySelector( select.cart.subtotalPrice);
    thisCart.dom.totalPrice = document.querySelector(select.cart.totalPrice);
    thisCart.dom.totalPriceTitle = document.querySelector(select.cart.totalPriceTitle);
    thisCart.dom.totalNumber = document.querySelector( select.cart.totalNumber);

    thisCart.dom.form = document.querySelector(select.cart.form);
    thisCart.dom.formSubmite = document.querySelector(select.cart.formSubmit);
    thisCart.dom.phone = document.querySelector(select.cart.phone);
    thisCart.dom.address = document.querySelector(select.cart.address);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
    
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(e){
      e.preventDefault();
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(e){
      e.preventDefault();
      thisCart.sendOrder();
    });
    console.log( thisCart.dom.form.addEventListener);
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    /* create element using utils.createElementFromHTML*/
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* find menu container*/

    /* add element to menu*/
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM)); // це означає що ми додаємо щось в CartProduct через команду new?
    thisCart.update();
  }
    
  update() {
    const thisCart = this;
    const deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0; //для загальної кількості товарів
    thisCart.subtotalPrice = 0; //загальна ціна за все
    thisCart.totalPrice = 0; 

    for (let product of thisCart.products) {
      //додайте for...of,який буде проходити через thisCart.products.
      thisCart.totalNumber += product.amount; //це збільшує totalNumber на кількість elementів даного продукту
      thisCart.subtotalPrice += product.price; //збільшиться subtotalPrice на його загальну ціну ( price)
    }
    if (thisCart.totalNumber != 0) {
      thisCart.totalPrice = thisCart.subtotalPrice  + deliveryFee;
    } if( thisCart.subtotalPrice === 0){
      thisCart.totalPrice ;   ///чому не прирівнюється до нуля?
    }

    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalPriceTitle.innerHTML = thisCart.totalPrice;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    console.log('totalPrice', thisCart.dom.totalPriceTitle.innerHTML);
    console.log('subTotalPrice', thisCart.dom.subtotalPrice.innerHTML);
    console.log('delivery', thisCart.dom.deliveryFee.innerHTML);
  }

  remove(cartProduct){
    const thisCart = this;

    //call to a cart , and splice a choosen product
    thisCart.products.splice(
      //find an index of product
      thisCart.products.indexOf(cartProduct),
      1
    );
    //delete from DOM 
    cartProduct.dom.wrapper.remove();
    //update the cart
    thisCart.update();
  }
  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      
      address: (thisCart.dom.address).value,//чому беремо в дужки?
      phone: (thisCart.dom.phone).value,
      totalPrice: thisCart.totalPrice, // не розумію де ми його діставали 
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee:settings.cart.defaultDeliveryFee,
      products: []
    };
    console.log('payload', payload);
    for(let prod of thisCart.products) {
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
      .then(function(response){
        return response.json(); // шо це за  response
      }).then(function(parsedResponse){ // шо це за  parsedResponse
        console.log('parsedResponse', parsedResponse); 
      }).catch(error)
      {console.error(error)};
  }
}

export default Cart;