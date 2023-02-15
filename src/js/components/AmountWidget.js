import { settings} from '../setting.js'; 
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element) {
    super(element, );
    const thisWidget = this;
    thisWidget.getElements(element, settings.amountWidget.defaultValue);
    //added
    //thisWidget.value = setting.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.input.value);
  }
  getElements(element){
    const thisWidget = this;
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector('.amount');
    thisWidget.linkDecrease = thisWidget.element.querySelector('a[href="#less"]');
    thisWidget.linkIncrease = thisWidget.element.querySelector('a[href="#more"]');
  }

  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    thisWidget.element.dispatchEvent(event);
  }

  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    /*TODO: Add validation*/
    if (newValue !== thisWidget.value && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
      thisWidget.value = newValue;
    }
    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }
  initActions() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;