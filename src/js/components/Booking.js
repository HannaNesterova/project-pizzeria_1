import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    //отримує посилання на контейнер, наданий у app.initBooking, як аргумент
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    //thisBooking.initTables();

    thisBooking.tablesClicked = [];
  }
  render(wrapper){
    const thisBooking = this;

    thisBooking.dom = {};
    thisBooking.dom.wrapper = wrapper;

    const generatedHTML = templates.bookingWidget();
    const element = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.wrapper.appendChild(element);

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.floor = document.querySelector(select.booking.floor);
    thisBooking.dom.tables = document.querySelectorAll(select.booking.tables);
    thisBooking.dom.sendResBtn = document.querySelector(select.booking.sendResBtn);
    thisBooking.dom.phone = document.querySelector(select.booking.phoneInput);
    thisBooking.dom.address = document.querySelector(select.booking.addressInput);
    thisBooking.dom.startersCheck = document.querySelectorAll(select.booking.startersCheck);
    thisBooking.dom.orderConfirmationInputs = document.querySelectorAll('.order-confirmation input');
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('update', function () {});

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('update', function () {});

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
 
    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();

    // thisBooking.dom.tables = addEventListener('click', function(){
    //  thisBooking.initTables();
    //  })
    });
  }

  getData() {
    const thisBooking = this;

    const startDateParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    console.log('getData params', params);
    const urls = {
      bookings:
        settings.db.url +
        '/' +
        settings.db.bookings +
        '?' +
        params.bookings.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.events +
        '?' +
        params.eventsRepeat.join('&'),
    };
    console.log('getData urls', urls);

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])

      .then((allResponses) => {
        const bookingsRespose = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsRespose.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(([bookings, eventsCurrent, eventsRepeat]) => {
        // console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }
    console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false;
    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      allAvailable = true;
    }
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.bookings.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

       
  initTables(){
    const thisBooking = this;

    for( let table of thisBooking.dom.tables){
     if(table.classList.contains(classNames.booking.tableBooked)){
      table.classList.remove(classNames.booking.tableClicked);
     }
    
    if(table.classList.contains('.table')){
      const tableNumb = table.getAttribute('data-table');;
      if(!table.classList.contains(classNames.booking.tableClicked) && !table.classList.contains(classNames.booking.tableBooked)){
        table.classList.add(classNames.booking.tableClicked);

        thisBooking.tablesClicked.push(tableNumb);
        console.log('tablesClicked: ',thisBooking.tablesClicked);

        for (let table of thisBooking.dom.tables){
          table.classList.remove('alert');
        }
      }  else if (table.classList.contains('selected') ){
        table.classList.remove(classNames.booking.tableClicked);

        const tableIndex = thisBooking.tablesClicked.indexOf(tableNumb);
        console.log(tableIndex);
        thisBooking.tablesClicked.splice(tableIndex, 1);
        console.log('tablesClicked: ',thisBooking.tablesClicked);
      } else {
      alert('This table is not available at this time!');
    }
  }
}
}


  sendBooking(){
  const thisBooking = this;

  const url = settings.db.url + '/' + settings.db.bookings;

  const payload = {

    date: thisBooking.datePicker.value,
    hour: thisBooking.hourPicker.value,
    table: Number( thisBooking.tablesClicked.toString() ),
    duration: thisBooking.hoursAmountWidget.value,
    ppl: thisBooking.peopleAmountWidget.value,
    starters: [],
    phone: thisBooking.dom.phone.value,
    address: thisBooking.dom.address.value
  };
  for( let input of thisBooking.dom.startersCheck){
    if( input.checked ){
      payload.starters.push(input.value);
    }
  }
  console.log('payload: ',payload);

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  fetch(url, options)
    .then((response) => {
      return response.json();
    }).then((parsedResponse) => {
      console.log('parsedResponse', parsedResponse);

      thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
      thisBooking.updateDOM();
    });

  for ( let input of thisBooking.dom.orderConfirmationInputs){
    input.classList.remove('alert');
    thisBooking.dom.address.value = '';
    thisBooking.dom.phone.value = '';
  }

  for ( let table of thisBooking.dom.tables){
    table.classList.remove('alert');
  }

  console.log(payload.table);
  }
}


export default Booking;