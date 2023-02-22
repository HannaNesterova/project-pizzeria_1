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

    const order = document.querySelector('a[href="#order"]');
    console.log('order', order);

    thisHome.btnOrder = document.querySelector('item-one');

    const booking = document.querySelector('a[href="#booking"]');
    console.log('booking', booking);

  }

   activePage() {
    const thisHome = this;
    
    if (thisHome.btnOrder) {
        thisHome.btnOrder.addEventListener('click', function() {
          // Add the "active" class to the "order" element
          order.classList.add('active');
          console.log('Button clicked!');
        });
     }
  }
}

export default Home;