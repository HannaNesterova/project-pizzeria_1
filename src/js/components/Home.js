import {templates} from '../settings.js';
import utils from '../utils.js';

class Home {
  constructor(element){
    const thisHome = this;
    thisHome.render(element);
    thisHome.activePage ();
  }

  render(wrapper){
    const thisHome = this;
    
    thisHome.dom = {};
    thisHome.dom.wrapper = wrapper;
    
    const generatedHTML = templates.homeWidget();
    const element = utils.createDOMFromHTML(generatedHTML);
    thisHome.dom.wrapper.appendChild(element);
     
    thisHome.order = document.querySelector('a[href="#order"]');
    const order = document.querySelector('a[href="#order"]');

    thisHome.btnOrder = document.querySelector('.item-one');
    thisHome.btnBooking = document.querySelector('.item-two');

    thisHome.booking = document.querySelector('a[href="#booking"]');
    const booking = document.querySelector('a[href="#booking"]');


  }

   activePage() {
    const thisHome = this;
    
    if (thisHome.btnOrder) {
        thisHome.btnOrder.addEventListener('click', function() {
          // Add the "active" class to the "order" element
          order.classList.toggle('active');
          thisHome.order.classList.toggle('active');
        });
     }if(thisHome.btnBooking){
        thisHome.btnBooking.addEventListener('click', function(){
            booking.classList.toggle('active');
            thisHome.booking.classList.toggle('active');
        })
     }
  }
}

export default Home;