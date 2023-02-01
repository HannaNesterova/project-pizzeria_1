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
        /* prevent default action for event */
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
      console.log(thisProduct.amountWidget );
      thisProduct.amountWidgetElement.addEventListener('updated',function(e){
        e.preventDefault();
        thisProduct.processOrder();
      });
   
    }

    processOrder(){
      const thisProduct = this;


      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log(formData);

      // set price to default price
      let price = thisProduct.data.price;
      console.log(price);

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
      console.log(thisProduct.priseSingle);
      thisProduct.priceElem.innerHTML = price;
      console.log(thisProduct.priceElem.innerHTML);
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
      console.log(formData);
      const params = {};
      
      // for every category (param)
      for(let paramId in thisProduct.data.params) {
        //determine params value
        const param = thisProduct.data.params[paramId];
        console.log(param);
        // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
        params[paramId] = {
          label: param.label,
          options: {}
        };
        console.log(params[paramId]);
        // for every option in this category
        for(let optionId in param.options) {
          //determine option value
          const option = param.options[optionId];
          console.log(option);
          //check if is psrsm with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          console.log(optionSelected);
      
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
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.setValue(thisWidget.input.value);
    }
    setValue(value){
      const thisWidget = this;
      // thisWidget.value = defaults.amountWidget.defaultValue;
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

      thisWidget.input.addEventListener('change', function (){
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
      console.log(thisCart.dom.toggleTrigger);
      thisCart.dom.productList = element.querySelector(select.cart.productList);
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
      console.log(generatedHTML);
  
      //cteate element using utils.createElementFromHTML
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      console.log(generatedDOM);
    
      
      //find menu container
      const cartContainer = document.querySelector(select.containerOf.cart);
      console.log(cartContainer);

      //add element to menu
      thisCart.dom.productList.appendChild(generatedDOM);
      console.log('type', menuProduct);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    }
  }
     class CartProduct {
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.getElements(element);



      thisCartProduct.id = menuProduct.id;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;
      thisCartProduct.priceSingle = menuProduct.priceSingle;


      console.log('CartTest',thisCartProduct);
    }
    getElements(element){
      const thisCartProduct = this;
      thisCartProduct.dom = {};

        thisCartProduct.dom.wrapper = element;
        console.log(element)
        thisCartProduct.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
        thisCartProduct.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
        thisCartProduct.edit = thisCartProduct.dom.wrapper.querySelector(select.cart.edit);
        thisCartProduct.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

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