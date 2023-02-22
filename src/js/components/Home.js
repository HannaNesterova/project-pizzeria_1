import {templates, select, classNames} from '../settings.js';
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

    thisHome.dom.order = document.querySelector('#order');
    thisHome.dom.btnOrder = document.querySelector('.home_container-item');
    console.log(thisHome.dom.order);
    console.log(thisHome.dom.btnOrder);

  }
  render(){
  const thisHome = this;
    const order = document.querySelector('a[href="#order"]');
    console.log('order', order);

    const booking = document.querySelector('a[href="#booking"]');
    console.log('booking', booking);
  }
   activePage() {
     const thisHome = this;
     if (thisHome.order) {
       thisHome.order.addEventListener('update', function() {
         thisHome.dom.order.classList.add('active');
         console.log('Button clicked!');
       });
     }
   }
  
/*activatePage (pageId) {
    const thisHome = this;
    thisHome.pages = document.querySelectorAll('pages');
    thisHome.navLinks = document.querySelectorAll(select.nav.links);
    console.log(thisHome.pages);

    /*add class Active to matching pages, remove class Active from non-matching pages */
    // for (let page of thisHome.pages) {
    //   page.classList.toggle(classNames.pages.active, page.id == pageId);
    // }
    // for (let link of thisHome.navLinks) {
    //   link.classList.toggle(
    //     classNames.nav.active,
    //     link.getAttribute('href') == '#' + pageId
    //   );
    // }
    /*add class Active to matching links, remove class Active from non-matching links */
  //}
}

export default Home;