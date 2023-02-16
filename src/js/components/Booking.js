
import { select, templates } from '../setting.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();

  }
  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;
    console.log( thisBooking.dom.wrapper);
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);

    thisBooking.dom.houseAmount = document.querySelector(select.booking.hoursAmount);
    console.log(thisBooking.dom.peopleAmount);


    thisBooking.dom.date = document.querySelector(select.widgets.datePicker.wrapper);
    console.log('date', thisBooking.dom.date);
    thisBooking.dom.hour = document.querySelector(select.widgets.hourPicker.wrapper);
    console.log('hour', thisBooking.dom.hour);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('update', function () { });

    thisBooking.houseAmount = new AmountWidget(thisBooking.dom.houseAmount);
    thisBooking.dom.houseAmount.addEventListener('update', function () { });

    thisBooking.date = new DatePicker(thisBooking.dom.date);
    thisBooking.dom.date.addEventListener('click', function() {});

    thisBooking.hour = new HourPicker(thisBooking.dom.hour);
    thisBooking.dom.hour.addEventListener('click', function() {});

  }

}

export default Booking;