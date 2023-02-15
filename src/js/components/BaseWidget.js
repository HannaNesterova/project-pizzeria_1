class BaseWidget{
    constructor(wrapperElement, initualValue){
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.value = initualValue;
    }
}
export default BaseWidget;