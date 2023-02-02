/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

//const { active } = require("browser-sync");
//const { active } = require ("browser-sync"); - it dosen't work!!!
//import { active } from "browser-sync";

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
  // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
  // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  // CODE ADDED END
  };
  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();



    }
    renderInMenu() {
      const thisProduct = this;

      // generate HTML based on template 
      const generatedHTML = templates.menuProduct(thisProduct.data); 
  
      //cteate element using utils.createElementFromHTML
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    
      //find menu container
      const menuContainer = document.querySelector(select.containerOf.menu);

      //add element to menu
      menuContainer.appendChild(thisProduct.element);
      //console.log(menuContainer);


      
    }
    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElement = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    initAccordion(){
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      //const clickableTrigger =thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
             
        //clickableTrigger.addEventListener('click', function(event) {
        event.preventDefault(); 

        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(activeProduct != thisProduct.element && activeProduct !== null) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive); 
      });
    }
    initOrderForm() {
      const thisProduct = this;
     
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
        
      });

    }
    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElement);
      thisProduct.amountWidgetElement.addEventListener('updated',function(e){
        e.preventDefault();
        thisProduct.processOrder();
      });
   
    }

    processOrder(){
      const thisProduct = this;


      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);

      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];

        /// for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];

          // check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected){

            // check if the option is not default
            if(!option.default){

              // add option price to price variable
              price += option.price;
            }
          } else {
          // check if the option is default
            if(option.default === true){

              // reduce price variable
              price -= option.price;
            }
          }
        
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

          if(optionImage) {
            if(optionSelected) {
              optionImage.classList.add('active');
            } else {
              optionImage.classList.remove('active');
            }
          }
        }
      }
      // update calculated price in the HTML

      thisProduct.priseSingle= price;
      thisProduct.priceElem.innerHTML = price;
    }
    addToCart(){
      const thisProduct = this;

      app.cart.add(thisProduct.readyCartProduct());


    }

    readyCartProduct (){
      const thisProduct = this;


      const productSummary = {
        id : thisProduct.id,
        name : thisProduct.data.name,
        amount :thisProduct.amountWidget.value,
        priceSingle: thisProduct.priseSingle,
        price: thisProduct.priseSingle  * thisProduct.amountWidget.value,
        params :  thisProduct.readyCartProductParams(),
      };
      return productSummary;
    }
  
    readyCartProductParams() {

      const thisProduct = this;
      //cover form to object structure {sauce:['tomato']}, toppings: ets...
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {};
      
      // for every category (param)
      for(let paramId in thisProduct.data.params) {
        //determine params value
        const param = thisProduct.data.params[paramId];
        // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
        params[paramId] = {
          label: param.label,
          options: {}
        };
        // for every option in this category
        for(let optionId in param.options) {
          //determine option value
          const option = param.options[optionId];
          //check if is psrsm with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
      
          if (optionSelected){ 
            params[paramId].options[optionId] = option.label; 
          }
        }
      }
      return params;
    }
  
  }
 


  
  class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.initActions();  
      thisWidget.setValue(settings.amountWidget.defaultValue); 
    }
    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      console.log(thisWidget.element);
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      console.log(thisWidget.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.setValue(thisWidget.input.value);
    }
    setValue(value){
      const thisWidget = this;
      //thisWidget.value = settings.amountWidget.defaultValue;
      const newValue = parseInt(value);

      // //TO DO : add validation 

      const {
        amountWidget: { defaultMax, defaultMin },
      } = settings;
      if (newValue > defaultMax || newValue < defaultMin) {
        return;
      }

      if (thisWidget.value !== newValue) {
        thisWidget.value = newValue;
      }
      /*TODO: Add validation*/
      if (thisWidget.value !== newValue && isNaN(newValue)) {
        thisWidget.value = newValue;
      }
      thisWidget.value = newValue;
      thisWidget.input.value = thisWidget.value;
      thisWidget.announce();
    }
    announce(){
      const thisWidget = this;
      const event =  new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }

    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function (e){
        e.preventDefault();
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click',function(){
    
        thisWidget.setValue(thisWidget.value -1);
      });
      thisWidget.linkIncrease.addEventListener('click',function (){

        thisWidget.setValue(thisWidget.value +1);
      });
    }

  }
 
  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products =[];
      thisCart.getElements(element);
      thisCart.initActions();
    }

    getElements(element){
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = element.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
      console.log('totaPice', thisCart.dom.totalPrice);
      thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
      console.log('totalNum', thisCart.dom.totalNumber);
    }
    
    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(e){
        e.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      // thisCart.dom.productList.addEventListener('updated', function(){
      //   thisCart.update();
      // })
      // thisCart.dom.productList.addEventListener('remove', function(){
      //   thisCart.remove();
      // })
    }
    
    add(menuProduct){
      const thisCart = this;


      // generate HTML based on template 
      const generatedHTML = templates.cartProduct(menuProduct); 
  
      //cteate element using utils.createElementFromHTML
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    
      
      //find menu container
      const cartContainer = document.querySelector(select.containerOf.cart);

      //add element to menu
      thisCart.dom.productList.appendChild(generatedDOM);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    }

      update(){
        const thisCart = this;
  
        thisCart.deliveryFee = classNames.cart.defaultDeliveryFee;
  
       let  totalNumber = 0;
       let subtotalPrice = 0;
  
       for(let product of thisCart.products){
        totalNumber += product.amountWidget;
        subtotalPrice += product.price;
       }

       if (totalNumber !=0){
        thisCart.totalPrice = subtotalPrice + this.deliveryFee;
        thisCart.dom.deliveryFee.innerHTML =  this.deliveryFee;
       }
       thisCart.dom.totalNumber.innerHTML = totalNumber;
       thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;

       for(let price of thisCart.dom.totalPrice){
        price.innerHTML = thisCart.totalPrice;
       }
      }
  }


     class CartProduct {
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.getElements(element);
      thisCartProduct. initAmountWidget();


      thisCartProduct.id = menuProduct.id;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
    }
    
    getElements(element){
      const thisCartProduct = this;
      thisCartProduct.dom = {};

        thisCartProduct.dom.wrapper = element;
        console.log(thisCartProduct.dom.wrapper);
        thisCartProduct.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
        console.log(thisCartProduct.amountWidget);
        thisCartProduct.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
        thisCartProduct.edit = thisCartProduct.dom.wrapper.querySelector(select.cart.edit);
        thisCartProduct.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
      }
          initAmountWidget(){
             const thisCartProduct = this;
    
         
             thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
             console.log(thisCartProduct.amountWidget );
             thisCartProduct.dom.amountWidget.addEventListener('updated',function(){

               thisCartProduct.amount = thisCartProduct.amountWidget.value;
               console.log(thisCartProduct.amount);
               thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
              thisCartProduct.dom.price.innerHTML = thisCartProduct.price
            });
      }
    }


  const app = {
    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource; 
    },

    initMenu : function() {
      const thisApp = this;

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
      // const testProduct = new Product();
      // console.log('testProduct:', testProduct)
    },
    init: function(){
      const thisApp = this;

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
  };
  app.init(); 

}