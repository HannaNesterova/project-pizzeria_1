
class Booking {
    constructor(element) {
      thisBooking = this;

      thisBooking.bookingContainer = element.querySelector(select.containerOf.booking)
      window.render(thisBooking.bookingContainer);
      initWidgets ();

    }
}


export default Booking;