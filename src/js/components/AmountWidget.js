import { settings} from '../setting.js'; 
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.initActions();
   
    //added
    //thisWidget.value = setting.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.input.value);
  }

  getElements(){
    const thisWidget = this;

    thisWidget.input = thisWidget.dom.wrapper.querySelector('.amount');
    thisWidget.linkDecrease = thisWidget.dom.wrapper.querySelector('a[href="#less"]');
    thisWidget.linkIncrease =thisWidget.dom.wrapper.querySelector('a[href="#more"]');
  }

  

  // parseValue(value){
  //   return parseInt(value);
  // }

  isValid(value){
    return  !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;
    
    thisWidget.dom.input.addEventListener('change', function() {
 
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function (e) {
      e.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function (e) {
      e.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);

    });
  }
  
}

export default AmountWidget;