
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
    }
}


export default Booking;