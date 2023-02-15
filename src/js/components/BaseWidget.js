class BaseWidget{
  constructor(wrapperElement, initualValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initualValue;
  }
  get value(){
    thisWidget = this;
    return thisWidget.correctValue;
  }
  set value(value) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    /*TODO: Add validation*/
    if (newValue !== thisWidget.correctValue && thisWidget.isValid(newValue)){
    thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
    //thisWidget.dom.input.value = thisWidget.correctValue;
  }
  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }
  
  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return  !isNaN(value);
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }
  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
export default BaseWidget;