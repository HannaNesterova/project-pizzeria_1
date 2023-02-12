const app = {
  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){ //what does it mean?
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log(parsedResponse);
        //save parsedResponse as thisApp.data.products;
        thisApp.data.products = parsedResponse; 

        //execute initMenu method
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
  },
  init: function(){
    const thisApp = this;
      
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
  },
};
  
app.init();



