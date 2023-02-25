import {select, templates} from '../settings.js';
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
     
    thisHome.home = document.querySelector('a[href="#home"]');
    thisHome.order = document.querySelector('a[href="#order"]');

    thisHome.btnOrder = document.querySelector('.item-one');
    thisHome.btnBooking = document.querySelector('.item-two');

    thisHome.booking = document.querySelector('a[href="#booking"]');
  }

  activePage() {
    const thisHome = this;
  
    if (thisHome.btnOrder) {
      thisHome.btnOrder.addEventListener('click', function() {
        order.classList.toggle('active');
        thisHome.home.classList.remove('active');
        home.classList.remove('active');
        thisHome.order.classList.toggle('active');
      });
    }
  
    if (thisHome.btnBooking) {
      thisHome.btnBooking.addEventListener('click', function() {
        booking.classList.toggle('active');
        thisHome.home.classList.remove('active');
        home.classList.remove('active');
        thisHome.booking.classList.toggle('active');
      });
    }
  }
}

export default Home;