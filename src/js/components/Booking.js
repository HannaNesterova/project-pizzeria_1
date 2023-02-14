import {select} from './setting.js';
import AmountWidget from './AmountWidget.js'; // is not defined

class Booking {

    constructor(element) {
      const thisBooking = this;
      thisBooking.render(element);
    }

      render (element) {
        const thisBooking = this;
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.initWidgets ();

        thisBooking.dom.peopleAmount = document.querySelector(select.cart.booking.peopleAmount);
        thisBooking.dom.hoursAmount=document.querySelector(select.cart.booking.hoursAmount);
      }
        initAmountWidget() {
         const thisBooking = this;
    
    
            //thisBooking.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
            //thisBooking.dom.amountWidget.addEventListener('updated', function () {
    
            thisBooking.amountPeople = thisBooking.dom.peopleAmount.value;
            thisBooking.hoursAmount = thisBooking.dom.hoursAmount.value;
    //       thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    //     });
    //   }
}
}


export default Booking;